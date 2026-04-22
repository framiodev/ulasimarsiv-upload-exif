<?php

namespace UlasimArsiv\UploadExif\Api\Controller;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Laminas\Diactoros\Response\JsonResponse;
use Flarum\Http\RequestUtil;

class GetWatermarksController implements RequestHandlerInterface
{
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        // 1. İstek yapan kullanıcıyı belirle
        $actor = RequestUtil::getActor($request);
        
        // Kullanıcı adı (Misafir ise veya klasör bulunamazsa varsayılan 'ulasimarsiv' olacak)
        $targetUser = $actor->isGuest() ? 'ulasimarsiv' : $actor->username;

        // 2. Klasör yollarını ayarla
        // Not: public_path fonksiyonunun çalıştığından emin olmak için Flarum'un helper'ını kullanıyoruz.
        // Eğer sunucuda bu fonksiyon hata verirse alternatif yol deneriz.
        $basePath = public_path('assets/watermarks');
        $userPath = $basePath . '/' . $targetUser;

        // Güvenlik ve Kontrol: Eğer kullanıcının adına özel klasör yoksa, 'ulasimarsiv' klasörüne düş
        if (!is_dir($userPath)) {
            $targetUser = 'ulasimarsiv';
            $userPath = $basePath . '/ulasimarsiv';
        }

        // Web üzerinden erişilecek URL kökü
        $webUrlBase = '/assets/watermarks/' . $targetUser;

        $files = [];

        // 3. Klasörü tara ve dosyaları ayrıştır
        if (is_dir($userPath)) {
            $scannedFiles = scandir($userPath);

            foreach ($scannedFiles as $file) {
                // Nokta dosyalarını ve gizli dosyaları atla
                if ($file === '.' || $file === '..') continue;

                $type = 'unknown';

                // Dosya isminde 'yatay' geçiyor mu?
                if (strpos($file, 'yatay') !== false) {
                    $type = 'landscape';
                } 
                // Dosya isminde 'dikey' geçiyor mu?
                elseif (strpos($file, 'dikey') !== false) {
                    $type = 'portrait';
                }

                // Sadece tipi belirlenebilen (yatay/dikey) dosyaları listeye ekle
                if ($type !== 'unknown') {
                    $files[] = [
                        'name' => $file,
                        'url'  => $webUrlBase . '/' . $file,
                        'type' => $type
                    ];
                }
            }
        }

        // 4. Sonucu basit JSON olarak döndür (Flarum serializer kullanmadan)
        return new JsonResponse(['watermarks' => $files]);
    }
}