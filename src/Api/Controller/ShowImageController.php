<?php

namespace UlasimInfo\UploadExif\Api\Controller;

use Flarum\Http\RequestUtil;
use Psr\Http\Message\ServerRequestInterface;
use Laminas\Diactoros\Response\JsonResponse;
use Psr\Http\Server\RequestHandlerInterface;
use Psr\Http\Message\ResponseInterface;
use UlasimInfo\UploadExif\Database\SpotterImage;
use Illuminate\Support\Arr;

class ShowImageController implements RequestHandlerInterface
{
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        // 1. ID'yi al
        $id = Arr::get($request->getQueryParams(), 'id');
        
        // 2. Resmi bul
        $image = SpotterImage::findOrFail($id);
        
        // 3. Modeli Diziye Çevir (Verilerin görünür olduğundan emin olmak için)
        $data = $image->toArray();

        // 4. Yetki Kontrolü
        // Eğer original_path sütunu varsa ama kullanıcı admin değilse, bu veriyi gizle.
        $actor = RequestUtil::getActor($request);
        if (!$actor->isAdmin()) {
            unset($data['original_path']);
        }

        // 5. JSON Döndür
        return new JsonResponse($data);
    }
}