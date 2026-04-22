<?php
namespace UlasimArsiv\UploadExif\Api\Controller;
use Flarum\Http\RequestUtil; use UlasimArsiv\UploadExif\Database\SpotterImage;
use Laminas\Diactoros\Response\JsonResponse;
class UserGalleryController implements \Psr\Http\Server\RequestHandlerInterface {
    public function handle(\Psr\Http\Message\ServerRequestInterface $request): \Psr\Http\Message\ResponseInterface {
        $actor = RequestUtil::getActor($request); $actor->assertRegistered();
        $images = SpotterImage::where('user_id', $actor->id)->orderBy('created_at', 'desc')->limit(50)->get();
        $images->transform(function ($img) { $img->mini_url = str_replace('thumb_', 'mini_', $img->thumb_path); return $img; });
        return new JsonResponse($images);
    }
}