<?php
namespace UlasimArsiv\UploadExif\Api\Controller;

use Flarum\Http\RequestUtil;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Laminas\Diactoros\Response\JsonResponse;

class UploadWatermarkController implements RequestHandlerInterface
{
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $actor = RequestUtil::getActor($request);
        $actor->assertAdmin();

        $body = $request->getParsedBody();
        $files = $request->getUploadedFiles();

        $username = trim($body['username'] ?? '');
        $type = trim($body['type'] ?? ''); // 'yatay' or 'dikey'
        $file = $files['watermark'] ?? null;

        if (empty($username) || empty($type) || !in_array($type, ['yatay', 'dikey'])) {
            return new JsonResponse(['error' => 'Geçersiz parametreler.'], 400);
        }

        if (!$file || $file->getError() !== UPLOAD_ERR_OK) {
            return new JsonResponse(['error' => 'Dosya yüklenemedi.'], 400);
        }

        $extension = strtolower(pathinfo($file->getClientFilename(), PATHINFO_EXTENSION));
        if ($extension !== 'png') {
            return new JsonResponse(['error' => 'Sadece PNG formatında dosyalar yüklenebilir.'], 400);
        }

        // Güvenlik: Username içinde zararlı karakterleri temizle
        $username = preg_replace('/[^a-zA-Z0-9_-]/', '', $username);

        $baseDir = public_path('assets/watermarks');
        $userDir = $baseDir . '/' . $username;

        if (!is_dir($userDir)) {
            mkdir($userDir, 0755, true);
        }

        // Otomatik İsimlendirme Mantığı
        $filename = $username . '_' . $type . '_wm.png';
        $fullPath = $userDir . '/' . $filename;

        // Eski dosya varsa üstüne yazacaktır.
        $file->moveTo($fullPath);

        return new JsonResponse([
            'success' => true,
            'message' => 'Watermark başarıyla yüklendi.',
            'path' => '/assets/watermarks/' . $username . '/' . $filename
        ]);
    }
}
