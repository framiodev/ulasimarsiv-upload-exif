<?php

namespace UlasimInfo\UploadExif\Api\Controller;

use Flarum\Http\RequestUtil;
use Flarum\Post\Post;
use Flarum\Settings\SettingsRepositoryInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Laminas\Diactoros\Response\JsonResponse;
use UlasimInfo\UploadExif\Database\SpotterImage;
use Google\Cloud\Storage\StorageClient;

class EditImageController implements RequestHandlerInterface
{
    protected $settings;

    const FIREBASE_KEY_PATH = '/home/spotters/ulasim-firebase.json';
    const FIREBASE_BUCKET = 'ulasim-info-storage-d312d.firebasestorage.app';

    public function __construct(SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $actor = RequestUtil::getActor($request);
        $actor->assertAdmin();

        $id = \Illuminate\Support\Arr::get($request->getQueryParams(), 'id');
        $data = $request->getParsedBody();
        $newNameRaw = $data['name'] ?? null;

        if (!$id || !$newNameRaw) {
            return new JsonResponse(['error' => 'Eksik parametre.'], 400);
        }

        $image = SpotterImage::find($id);
        if (!$image) {
            return new JsonResponse(['error' => 'Görsel bulunamadı.'], 404);
        }

        // 1. İsim Hazırlığı (DÜZELTİLDİ: Boşluk ve Büyüklük Korunuyor)
        $info = pathinfo($image->filename);
        $ext = $info['extension'] ?? 'jpg';
        
        // Sadece dosya sistemine zarar verebilecek karakterleri temizle, boşluklara izin ver
        // İzin verilenler: Harfler, Rakamlar, Boşluk, Tire, Alt Çizgi
        $safeName = preg_replace('/[^a-zA-Z0-9\s\-_]/u', '', $newNameRaw);
        $safeName = trim($safeName); // Baştaki sondaki boşlukları al
        
        // Dosya adı boş kaldıysa timestamp ata
        if (empty($safeName)) {
            $safeName = time();
        }

        $newFilename = $safeName . '.' . $ext;
        
        // Benzersizlik için timestamp ekliyoruz (Storage tarafında çakışma olmasın)
        $newSafeName = time() . '_' . str_replace(' ', '-', $safeName) . '.' . $ext; 
        $newOriginalSafeName = time() . '_' . str_replace(' ', '-', $safeName) . '_orijinal.' . $ext;

        // Eski yolları çözümle
        $bucketPrefix = self::FIREBASE_BUCKET . '/';
        $relativeOldPath = str_replace('https://storage.googleapis.com/' . $bucketPrefix, '', $image->path);
        $folderPath = dirname($relativeOldPath);

        $oldName = basename($image->path);
        $oldThumbName = basename($image->thumb_path);
        // Mini ismini thumb üzerinden bulmaya çalış
        $oldMiniName = 'mini_' . str_replace('thumb_', '', $oldThumbName);
        
        $oldOriginalName = $image->original_path ? basename($image->original_path) : null;

        // --- FIREBASE İŞLEMLERİ ---
        $storage = new StorageClient(['keyFilePath' => self::FIREBASE_KEY_PATH]);
        $bucket = $storage->bucket(self::FIREBASE_BUCKET);

        try {
            // Ana Dosya
            $this->renameOnCloud($bucket, $folderPath . '/' . $oldName, $folderPath . '/' . $newSafeName);
            
            // Thumbnail
            $newThumbName = 'thumb_' . $newSafeName;
            $this->renameOnCloud($bucket, $folderPath . '/' . $oldThumbName, $folderPath . '/' . $newThumbName);

            // Mini
            $newMiniName = 'mini_' . $newSafeName;
            $this->renameOnCloud($bucket, $folderPath . '/' . $oldMiniName, $folderPath . '/' . $newMiniName);

            // Orijinal (Varsa)
            $newOriginalUrl = null;
            if ($oldOriginalName) {
                $this->renameOnCloud($bucket, $folderPath . '/' . $oldOriginalName, $folderPath . '/' . $newOriginalSafeName);
                $newOriginalUrl = 'https://storage.googleapis.com/' . self::FIREBASE_BUCKET . '/' . $folderPath . '/' . $newOriginalSafeName;
            }

            // Yeni URL'ler
            $baseUrl = 'https://storage.googleapis.com/' . self::FIREBASE_BUCKET . '/' . $folderPath . '/';
            $newPath = $baseUrl . $newSafeName;
            $newThumbPath = $baseUrl . $newThumbName;

            // --- BBCODE GÜNCELLEME ---
            $posts = Post::where('content', 'like', '%[spotter-image id=' . $image->id . '%')->get();
            
            foreach ($posts as $post) {
                // Regex ile eski url ve alt text'i bulup yenisiyle değiştir
                $pattern = '/\[spotter-image id=' . $image->id . ' url="([^"]+)" alt="([^"]+)"\]/';
                $replacement = '[spotter-image id=' . $image->id . ' url="' . $newThumbPath . '" alt="' . $safeName . '"]';
                
                $newContent = preg_replace($pattern, $replacement, $post->content);
                
                if ($newContent !== $post->content) {
                    $post->content = $newContent;
                    $post->save();
                }
            }

            // --- DB GÜNCELLEME ---
            $image->filename = $newFilename; // Kullanıcının girdiği "34 UCD 09.jpg" gibi görünen isim
            $image->path = $newPath;
            $image->thumb_path = $newThumbPath;
            if ($newOriginalUrl) {
                $image->original_path = $newOriginalUrl;
            }
            $image->save();

            return new JsonResponse([
                'success' => true, 
                'filename' => $newFilename,
                'url' => $newPath,
                'thumb_path' => $newThumbPath
            ]);

        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'İsim değiştirme hatası: ' . $e->getMessage()], 500);
        }
    }

    // DÜZELTİLEN FONKSİYON (PUBLIC READ EKLENDİ)
    private function renameOnCloud($bucket, $oldPath, $newPath) {
        $object = $bucket->object($oldPath);
        if ($object->exists()) {
            // DÜZELTME: Kopyalanan dosyaya 'publicRead' izni veriyoruz.
            // Bu olmadan dosya kopyalanır ama gizli olur, forumda 403 hatası verir (Kırık Resim).
            $object->copy($bucket, [
                'name' => $newPath,
                'predefinedAcl' => 'publicRead' 
            ]); 
            $object->delete();       
        }
    }
}