<?php

namespace UlasimArsiv\UploadExif\Api\Controller;

use Laminas\Diactoros\Response\JsonResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use UlasimArsiv\UploadExif\Database\VehicleTaxonomy;

class ListTaxonomyController implements RequestHandlerInterface
{
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $queryParams = $request->getQueryParams();
        $discussionId = $queryParams['discussion_id'] ?? null;

        $query = VehicleTaxonomy::orderBy('brand')->orderBy('model');
        
        if ($discussionId !== null) {
            $query->where('discussion_id', $discussionId)
                  ->orWhereNull('discussion_id')
                  ->orWhere('discussion_id', 0);
        }

        $taxonomy = $query->get();

        return new JsonResponse([
            'data' => $taxonomy
        ]);
    }
}
