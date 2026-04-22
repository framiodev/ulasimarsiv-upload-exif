<?php
namespace UlasimArsiv\UploadExif\Api\Controller;

use Flarum\Http\RequestUtil;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Laminas\Diactoros\Response\JsonResponse;

class ListAdminWatermarksController implements RequestHandlerInterface
{
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $actor = RequestUtil::getActor($request);
        $actor->assertAdmin();

        $baseDir = public_path('assets/watermarks');
        $result = [];

        if (is_dir($baseDir)) {
            $folders = array_diff(scandir($baseDir), ['.', '..']);
            foreach ($folders as $folder) {
                if (is_dir($baseDir . '/' . $folder)) {
                    $files = array_diff(scandir($baseDir . '/' . $folder), ['.', '..']);
                    $watermarks = [];
                    foreach ($files as $file) {
                        if (strtolower(pathinfo($file, PATHINFO_EXTENSION)) === 'png') {
                            $type = 'other';
                            if (strpos($file, '_yatay_wm.png') !== false) {
                                $type = 'yatay';
                            } elseif (strpos($file, '_dikey_wm.png') !== false) {
                                $type = 'dikey';
                            }
                            $watermarks[] = [
                                'filename' => $file,
                                'type' => $type,
                                'url' => '/assets/watermarks/' . $folder . '/' . $file
                            ];
                        }
                    }
                    $result[] = [
                        'username' => $folder,
                        'watermarks' => $watermarks
                    ];
                }
            }
        }

        return new JsonResponse(['data' => $result]);
    }
}
