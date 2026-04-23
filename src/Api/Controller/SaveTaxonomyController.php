<?php

namespace UlasimArsiv\UploadExif\Api\Controller;

use Flarum\Http\RequestUtil;
use Laminas\Diactoros\Response\JsonResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use UlasimArsiv\UploadExif\Database\VehicleTaxonomy;

class SaveTaxonomyController implements RequestHandlerInterface
{
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $actor = RequestUtil::getActor($request);
        $actor->assertAdmin();

        $body = $request->getParsedBody();
        $action = $body['action'] ?? 'save';

        if ($action === 'delete') {
            $id = $body['id'] ?? null;
            if ($id) {
                VehicleTaxonomy::find($id)->delete();
                return new JsonResponse(['success' => true, 'message' => 'Silindi.']);
            }
        }

        $brand = $body['brand'] ?? '';
        $model = $body['model'] ?? '';
        $type = $body['type'] ?? 'bus';

        if (empty($brand) || empty($model)) {
            return new JsonResponse(['error' => 'Marka ve model boş olamaz.'], 400);
        }

        $item = VehicleTaxonomy::create([
            'brand' => trim($brand),
            'model' => trim($model),
            'type' => $type
        ]);

        return new JsonResponse([
            'success' => true,
            'data' => $item
        ]);
    }
}
