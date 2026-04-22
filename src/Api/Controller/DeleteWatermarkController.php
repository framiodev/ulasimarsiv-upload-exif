<?php
namespace UlasimArsiv\UploadExif\Api\Controller;

use Flarum\Http\RequestUtil;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Laminas\Diactoros\Response\JsonResponse;

class DeleteWatermarkController implements RequestHandlerInterface
{
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $actor = RequestUtil::getActor($request);
        $actor->assertAdmin();

        $body = $request->getParsedBody();
        $username = trim($body['username'] ?? '');
        $filename = trim($body['filename'] ?? '');

        if (empty($username) || empty($filename)) {
            return new JsonResponse(['error' => 'Geçersiz parametreler.'], 400);
        }

        // Güvenlik: Dizin traversal saldırılarını önle
        if (strpos($username, '..') !== false || strpos($filename, '..') !== false || strpos($username, '/') !== false || strpos($filename, '/') !== false) {
            return new JsonResponse(['error' => 'Güvenlik ihlali.'], 403);
        }

        $filePath = public_path('assets/watermarks/' . $username . '/' . $filename);

        if (file_exists($filePath)) {
            unlink($filePath);
            
            // Eğer klasör boş kaldıysa sil
            $dirPath = public_path('assets/watermarks/' . $username);
            $remainingFiles = array_diff(scandir($dirPath), ['.', '..']);
            if (count($remainingFiles) === 0) {
                rmdir($dirPath);
            }

            return new JsonResponse(['success' => true]);
        }

        return new JsonResponse(['error' => 'Dosya bulunamadı.'], 404);
    }
}
