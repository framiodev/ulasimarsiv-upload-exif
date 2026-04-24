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
        $discussionInput = $body['discussion'] ?? '';

        $discussionId = null;
        if (!empty($discussionInput)) {
            // URL parse (e.g., https://forum.ulasimarsiv.com/d/1-mercedes-benz-travego)
            if (preg_match('/\/d\/(\d+)/', $discussionInput, $matches)) {
                $discussionId = (int) $matches[1];
            } elseif (is_numeric($discussionInput)) {
                $discussionId = (int) $discussionInput;
            }
        }

        if (empty($brand) || empty($model)) {
            return new JsonResponse(['error' => 'Marka ve model boş olamaz.'], 400);
        }

        $item = VehicleTaxonomy::create([
            'brand' => trim($brand),
            'model' => trim($model),
            'type' => $type,
            'discussion_id' => $discussionId
        ]);

        return new JsonResponse([
            'success' => true,
            'data' => $item
        ]);
    }
}
