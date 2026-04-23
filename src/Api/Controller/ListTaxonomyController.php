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
        $taxonomy = VehicleTaxonomy::orderBy('brand')->orderBy('model')->get();

        return new JsonResponse([
            'data' => $taxonomy
        ]);
    }
}
