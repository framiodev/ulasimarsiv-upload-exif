<?php

namespace UlasimInfo\UploadExif\Api\Controller;

use Flarum\User\User;
use Flarum\Http\RequestUtil;
use Flarum\Settings\SettingsRepositoryInterface;
use Intervention\Image\ImageManager;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Laminas\Diactoros\Response\JsonResponse;
use UlasimInfo\UploadExif\Database\SpotterImage;
use Google\Cloud\Storage\StorageClient;
use Throwable;

class UploadImageController implements RequestHandlerInterface
{
    protected $uploadPath;
    protected $settings;

    // --- FIREBASE AYARLARI ---
    const FIREBASE_KEY_PATH = '/home/ulasimin/ulasim-firebase.json'; 
    const FIREBASE_BUCKET = 'ulasim-info-storage-d312d.firebasestorage.app'; 
    // -------------------------

    public function __construct(SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
        $this->uploadPath = public_path('assets/temp_processing');
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        try {
            // 1. AYARLAR
            $settingWidth = $this->settings->get('ulasiminfo-upload-exif.resize_width');
            $maxWidth = (is_numeric($settingWidth) && (int)$settingWidth > 0) ? (int)$settingWidth : 3840;

            $settingThumb = $this->settings->get('ulasiminfo-upload-exif.thumb_width');
            $thumbWidth = (is_numeric($settingThumb) && (int)$settingThumb > 0) ? (int)$settingThumb : 1024;

            $settingMini = $this->settings->get('ulasiminfo-upload-exif.mini_width');
            $miniWidth = (is_numeric($settingMini) && (int)$settingMini > 0) ? (int)$settingMini : 250;

            $origResize = $this->settings->get('ulasiminfo-upload-exif.original_resize_width');
            $origQuality = $this->settings->get('ulasiminfo-upload-exif.original_compression_quality'); 

            @ini_set('memory_limit', '512M');
            @ini_set('max_execution_time', 300);

            $actor = RequestUtil::getActor($request);
            $actor->assertRegistered();

            $files = $request->getUploadedFiles();
            $file = $files['spotter_image'] ?? null;
            $body = $request->getParsedBody();
            
            $watermarkFilename = $body['watermark_type'] ?? 'none';
            
            // Parametreler
            $targetUsername = $body['target_username'] ?? null;
            $targetWmType = $body['target_watermark_type'] ?? 'yatay';
            
            // --- YENİ: ÖZEL DOSYA ADI PARAMETRESİ ---
            $customFilenameInput = $body['custom_filename'] ?? null;
            // ----------------------------------------

            if (!$file || $file->getError() !== UPLOAD_ERR_OK) {
                 return new JsonResponse(['error' => 'Dosya yüklenemedi veya sunucu limiti aşıldı.'], 400);
            }

            // 2. KLASÖR KONTROLÜ
            if (!is_dir($this->uploadPath)) {
                if (!mkdir($this->uploadPath, 0755, true)) {
                    throw new \Exception("Geçici klasör oluşturulamadı.");
                }
            }

            // --- YENİ: DOSYA ADI BELİRLEME MANTIĞI ---
            $clientFilename = $file->getClientFilename();
            $extension = pathinfo($clientFilename, PATHINFO_EXTENSION); // Orijinal uzantıyı al (jpg, png vb.)

            if (!empty($customFilenameInput)) {
                // Kullanıcı özel bir ad girdiyse onu kullan, uzantıyı sonuna ekle
                // Güvenlik için dosya adındaki yasaklı karakterleri temizleyebiliriz ama
                // şimdilik trim yeterli, Flarum slug oluştururken halleder.
                $originalName = trim($customFilenameInput) . '.' . $extension;
            } else {
                // Girmediyse orijinal adı kullan
                $originalName = $clientFilename;
            }
            // ------------------------------------------

            $safeName = time() . '_' . $originalName; 
            $localFullPath = "$this->uploadPath/$safeName";
            
            // 3. KAYDET
            $file->moveTo($localFullPath);

            // 4. EXIF
            $exifRaw = @exif_read_data($localFullPath);
            $cleanExif = $this->parseExif($exifRaw);

            // 5. ORİJİNAL YEDEK
            $pathInfo = pathinfo($safeName);
            $ext = isset($pathInfo['extension']) ? '.' . $pathInfo['extension'] : '';
            $originalSafeName = $pathInfo['filename'] . '_orijinal' . $ext;
            $tempBackupPath = "$this->uploadPath/$originalSafeName";
            
            if (!copy($localFullPath, $tempBackupPath)) {
                throw new \Exception("Orijinal dosya yedeği alınamadı.");
            }

            // 6. İŞLEME
            $driver = extension_loaded('imagick') ? 'imagick' : 'gd';
            $manager = new ImageManager(['driver' => $driver]);

            // Yedek İşleme
            if (($origResize && (int)$origResize > 0) || ($origQuality && (int)$origQuality < 100)) {
                $imgOrig = $manager->make($tempBackupPath);
                if ($origResize) {
                    $imgOrig->resize($origResize, null, function ($c) { $c->aspectRatio(); $c->upsize(); });
                }
                $q = $origQuality ? (int)$origQuality : 100;
                $imgOrig->save($tempBackupPath, $q);
                $imgOrig->destroy();
            }

            // Ana Dosya İşleme
            $imgWatermarked = $manager->make($localFullPath);
            $imgWatermarked->resize($maxWidth, null, function ($c) { $c->aspectRatio(); $c->upsize(); });

            // Watermark
            $shouldApplyWatermark = ($watermarkFilename !== 'none' && !empty($watermarkFilename)) || ($actor->isAdmin() && !empty($targetUsername));

            if ($shouldApplyWatermark) {
                $baseWmDir = public_path('assets/watermarks');
                $validWmPath = null;

                if ($actor->isAdmin() && !empty($targetUsername)) {
                    $targetUserClean = trim($targetUsername);
                    $suffix = ($targetWmType === 'dikey') ? '_dikey_wm.png' : '_yatay_wm.png';
                    $constructedFilename = $targetUserClean . $suffix;
                    $candidatePath = $baseWmDir . '/' . $targetUserClean . '/' . $constructedFilename;
                    if (file_exists($candidatePath)) $validWmPath = $candidatePath;
                } 
                elseif ($watermarkFilename !== 'none') {
                    $userWmPath = $baseWmDir . '/' . $actor->username . '/' . $watermarkFilename;
                    $defaultWmPath = $baseWmDir . '/ulasiminfo/' . $watermarkFilename;
                    if (file_exists($userWmPath)) $validWmPath = $userWmPath;
                    elseif (file_exists($defaultWmPath)) $validWmPath = $defaultWmPath;
                }

                if ($validWmPath) {
                    $wm = $manager->make($validWmPath);
                    
                    // --- FULL WIDTH WATERMARK (Önceki Revize) ---
                    $targetWidth = $imgWatermarked->width();
                    $wm->resize($targetWidth, null, function ($c) { $c->aspectRatio(); });
                    $imgWatermarked->insert($wm, 'bottom'); // En alta tam genişlikte bas
                    // --------------------------------------------
                    
                    $wm->destroy();
                }
            }

            $imgWatermarked->save($localFullPath, 90); 
            $this->transferExifData($tempBackupPath, $localFullPath);

            // 7. THUMBNAIL / MINI
            $imgThumb = clone $imgWatermarked; 
            $imgThumb->resize($thumbWidth, null, function ($c) { $c->aspectRatio(); $c->upsize(); });
            $thumbName = 'thumb_' . $safeName;
            $localThumbPath = "$this->uploadPath/$thumbName";
            $imgThumb->save($localThumbPath, 80);
            $imgThumb->destroy();

            $imgMini = clone $imgWatermarked; 
            $imgMini->resize($miniWidth, null, function ($c) { $c->aspectRatio(); $c->upsize(); });
            $miniName = 'mini_' . $safeName;
            $localMiniPath = "$this->uploadPath/$miniName";
            $imgMini->save($localMiniPath, 70);
            $imgMini->destroy();
            
            $imgWatermarked->destroy();

            // 8. FIREBASE
            $storage = new StorageClient(['keyFilePath' => self::FIREBASE_KEY_PATH]);
            $bucket = $storage->bucket(self::FIREBASE_BUCKET);

            $subDir = date('Y/m');
            $cloudFolder = 'assets/spotters/' . $subDir . '/';
            $firebaseBaseUrl = 'https://storage.googleapis.com/' . self::FIREBASE_BUCKET;

            $bucket->upload(fopen($localFullPath, 'r'), ['name' => $cloudFolder . $safeName, 'predefinedAcl' => 'publicRead', 'metadata' => ['contentType' => 'image/jpeg']]);
            $finalMainUrl = $firebaseBaseUrl . '/' . $cloudFolder . $safeName;

            $bucket->upload(fopen($localThumbPath, 'r'), ['name' => $cloudFolder . $thumbName, 'predefinedAcl' => 'publicRead', 'metadata' => ['contentType' => 'image/jpeg']]);
            $finalThumbUrl = $firebaseBaseUrl . '/' . $cloudFolder . $thumbName;

            $bucket->upload(fopen($localMiniPath, 'r'), ['name' => $cloudFolder . $miniName, 'predefinedAcl' => 'publicRead', 'metadata' => ['contentType' => 'image/jpeg']]);

            $bucket->upload(fopen($tempBackupPath, 'r'), ['name' => $cloudFolder . $originalSafeName, 'predefinedAcl' => 'publicRead', 'metadata' => ['contentType' => 'image/jpeg']]);
            $finalOriginalUrl = $firebaseBaseUrl . '/' . $cloudFolder . $originalSafeName;

            // 9. TEMİZLİK
            @unlink($localFullPath);
            @unlink($localThumbPath);
            @unlink($localMiniPath);
            @unlink($tempBackupPath); 

            // 10. DB KAYIT
            $ownerId = $actor->id;
            if ($actor->isAdmin() && !empty($targetUsername)) {
                $targetUserObj = User::where('username', trim($targetUsername))->first();
                if ($targetUserObj) $ownerId = $targetUserObj->id;
            }

            $imageModel = new SpotterImage();
            $imageModel->user_id = $ownerId;
            $imageModel->filename = $originalName; // Artık özel isim varsa o kaydedilir
            $imageModel->path = $finalMainUrl;
            $imageModel->original_path = $finalOriginalUrl;
            $imageModel->thumb_path = $finalThumbUrl;
            $imageModel->exif_data = json_encode($cleanExif);
            
            if (!$imageModel->save()) {
                throw new \Exception("Veritabanı kaydı başarısız oldu.");
            }

            $pathInfo = pathinfo($originalName);
            $altText = str_replace(['-', '_'], ' ', $pathInfo['filename']);
            $bbcode = "[spotter-image id={$imageModel->id} url=\"{$imageModel->thumb_path}\" alt=\"{$altText}\"]";

            return new JsonResponse([
                'id' => $imageModel->id,
                'url' => $imageModel->path,
                'original_url' => $imageModel->original_path,
                'bbcode' => $bbcode
            ]);

        } catch (Throwable $e) {
            if (isset($localFullPath) && file_exists($localFullPath)) @unlink($localFullPath);
            if (isset($localThumbPath) && file_exists($localThumbPath)) @unlink($localThumbPath);
            if (isset($localMiniPath) && file_exists($localMiniPath)) @unlink($localMiniPath);
            if (isset($tempBackupPath) && file_exists($tempBackupPath)) @unlink($tempBackupPath);

            return new JsonResponse([
                'error' => 'Görsel yüklenirken bir sorun oluştu.',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    private function parseExif($exif) {
        if (!$exif || !is_array($exif)) return null;
        $make = isset($exif['Make']) ? trim($exif['Make']) : 'Bilinmiyor';
        $model = isset($exif['Model']) ? trim($exif['Model']) : 'Bilinmiyor';
        if ($make !== 'Bilinmiyor' && stripos($model, $make) === 0) { $model = trim(substr($model, strlen($make))); }
        $focal = null;
        if (isset($exif['FocalLength'])) { $focal = $this->evalFraction($exif['FocalLength']) . ' mm'; }
        $aperture = $exif['COMPUTED']['ApertureFNumber'] ?? $exif['FNumber'] ?? null;
        $exposure = $exif['ExposureTime'] ?? null;
        $iso = $exif['ISOSpeedRatings'] ?? $exif['ISOSpeed'] ?? null;
        if (is_array($iso)) $iso = $iso[0];
        $lens = $exif['LensModel'] ?? $exif['LensInfo'] ?? $exif['UndefinedTag:0xA434'] ?? null;
        $lat = $this->getGps($exif['GPSLatitude'] ?? null, $exif['GPSLatitudeRef'] ?? null);
        $lon = $this->getGps($exif['GPSLongitude'] ?? null, $exif['GPSLongitudeRef'] ?? null);
        return [ 'make' => $make, 'model' => $model, 'lens' => $lens, 'aperture' => $aperture, 'exposure' => $exposure, 'iso' => $iso, 'focal' => $focal, 'date' => $exif['DateTimeOriginal'] ?? null, 'lat' => $lat, 'lon' => $lon ];
    }

    private function getGps($exifCoord, $hemi) {
        if (!isset($exifCoord) || !isset($hemi)) return null;
        $degrees = count($exifCoord) > 0 ? $this->evalFraction($exifCoord[0]) : 0;
        $minutes = count($exifCoord) > 1 ? $this->evalFraction($exifCoord[1]) : 0;
        $seconds = count($exifCoord) > 2 ? $this->evalFraction($exifCoord[2]) : 0;
        $flip = ($hemi == 'W' || $hemi == 'S') ? -1 : 1;
        return $flip * ($degrees + ($minutes / 60) + ($seconds / 3600));
    }

    private function evalFraction($fraction) {
        $parts = explode('/', $fraction);
        if (count($parts) == 2 && $parts[1] != 0) {
            return $parts[0] / $parts[1];
        }
        return (float)$fraction;
    }

    private function transferExifData($s, $d) 
    { 
        try { 
            $srcContent = file_get_contents($s); 
            $destContent = file_get_contents($d); 
            if (substr($srcContent, 0, 2) !== "\xFF\xD8" || substr($destContent, 0, 2) !== "\xFF\xD8") return; 
            
            $exifData = null; 
            $len = strlen($srcContent); 
            $pos = 2; 
            while ($pos < $len) { 
                $marker = substr($srcContent, $pos, 2); 
                $size = unpack('n', substr($srcContent, $pos + 2, 2))[1]; 
                if ($marker === "\xFF\xE1") { 
                    $exifData = substr($srcContent, $pos, $size + 2); 
                    break; 
                } 
                $pos += 2 + $size; 
            } 
            if ($exifData) { 
                $newDestContent = substr($destContent, 0, 2) . $exifData . substr($destContent, 2); 
                file_put_contents($d, $newDestContent); 
            } 
        } catch (\Exception $e) { } 
    }
}