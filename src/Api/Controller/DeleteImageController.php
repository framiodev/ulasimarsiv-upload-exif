<?php

namespace UlasimInfo\UploadExif\Api\Controller;

use Flarum\Http\RequestUtil;
use Flarum\Api\Controller\AbstractDeleteController;
use Psr\Http\Message\ServerRequestInterface;
use UlasimInfo\UploadExif\Database\SpotterImage;
use Illuminate\Support\Arr;
use Laminas\Diactoros\Response\EmptyResponse;
use Google\Cloud\Storage\StorageClient;

class DeleteImageController extends AbstractDeleteController
{
    // UploadController ile aynı Firebase ayarlarını kullanıyoruz
    const FIREBASE_KEY_PATH = '/home/spotters/ulasim-firebase.json'; 
    const FIREBASE_BUCKET = 'ulasim-info-storage-d312d.firebasestorage.app'; 

    protected function delete(ServerRequestInterface $request)
    {
        $actor = RequestUtil::getActor($request);
        $actor->assertRegistered();

        $id = Arr::get($request->getQueryParams(), 'id');
        // 'target' parametresini alıyoruz (Frontend'den 'original' gönderilirse yakalayacağız)
        $target = Arr::get($request->getQueryParams(), 'target'); 

        $image = SpotterImage::findOrFail($id);

        // Kural: Kullanıcı sadece kendi resmini silebilir VEYA Admin herkesinkini silebilir.
        if ($image->user_id !== $actor->id && !$actor->isAdmin()) {
            throw new \Flarum\User\Exception\PermissionDeniedException;
        }

        // --- SENARYO 1: SADECE ORİJİNAL YEDEĞİ SİL (Yer Açmak İçin) ---
        // Bu işlem veritabanı kaydını silmez, sadece original_path alanını boşaltır.
        if ($target === 'original') {
            if ($image->original_path) {
                // 1. Dosyayı Firebase'den sil
                $this->deleteFromFirebase($image->original_path);
                
                // 2. DB'den sadece linki sil, satırı koru
                $image->original_path = null;
                $image->save();
            }
            // İşlem tamam, 204 No Content döndür (AbstractDeleteController delete metodu response dönebilir)
            return new EmptyResponse(204);
        }

        // --- SENARYO 2: KOMPLE SİLME (Normal Medya Yöneticisi) ---
        // Bu işlem her şeyi (Tüm varyasyonları ve DB kaydını) siler.
        
        // 1. Tüm varyasyonları Firebase'den sil
        if ($image->path) $this->deleteFromFirebase($image->path);
        if ($image->thumb_path) $this->deleteFromFirebase($image->thumb_path);
        if ($image->original_path) $this->deleteFromFirebase($image->original_path);
        
        // Mini path veritabanında ayrı sütun olarak tutulmuyor ama upload mantığında oluşturuluyor.
        // Thumb path üzerinden adını tahmin edip onu da silelim.
        // Örn: .../thumb_123.jpg -> .../mini_123.jpg
        if ($image->thumb_path) {
            $miniPath = str_replace('thumb_', 'mini_', $image->thumb_path);
            $this->deleteFromFirebase($miniPath);
        }

        // 2. Yerel kalıntıları temizle (Eğer sunucuda temp dosya kaldıysa diye güvenlik önlemi)
        $basePath = public_path(); 
        $relativePath = ltrim(parse_url($image->path, PHP_URL_PATH), '/');
        if (file_exists("$basePath/$relativePath")) @unlink("$basePath/$relativePath");
        
        // 3. Veritabanından kaydı tamamen sil
        $image->delete();
    }

    /**
     * Firebase URL'inden dosya ismini çıkarıp silme işlemini yapan yardımcı fonksiyon
     */
    private function deleteFromFirebase($fullUrl) {
        if (!$fullUrl) return;

        try {
            // URL örneği: https://storage.googleapis.com/BUCKET_ADI/assets/spotters/2026/02/dosya.jpg
            // Bizim ihtiyacımız olan Object Name: assets/spotters/2026/02/dosya.jpg
            
            $bucketUrl = 'https://storage.googleapis.com/' . self::FIREBASE_BUCKET . '/';
            $objectName = str_replace($bucketUrl, '', $fullUrl);
            
            // Eğer URL yapısı farklıysa veya replace çalışmazsa alternatif parse:
            if ($objectName === $fullUrl) {
                $parts = parse_url($fullUrl);
                $path = ltrim($parts['path'], '/'); 
                // Path bazen bucket adını da içerir, onu temizle
                $objectName = str_replace(self::FIREBASE_BUCKET . '/', '', $path);
            }

            $storage = new StorageClient(['keyFilePath' => self::FIREBASE_KEY_PATH]);
            $bucket = $storage->bucket(self::FIREBASE_BUCKET);
            $object = $bucket->object($objectName);
            
            if ($object->exists()) {
                $object->delete();
            }
        } catch (\Exception $e) {
            // Silme sırasında dosya bulunamazsa hata verme, devam et (Idempotency)
        }
    }
}