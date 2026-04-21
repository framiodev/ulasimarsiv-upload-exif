<?php

use Flarum\Extend;
use s9e\TextFormatter\Configurator;
use UlasimInfo\UploadExif\Api\Controller\UploadImageController;
use UlasimInfo\UploadExif\Api\Controller\ShowImageController;
use UlasimInfo\UploadExif\Api\Controller\ListImagesController;
use UlasimInfo\UploadExif\Api\Controller\UserGalleryController;
use UlasimInfo\UploadExif\Api\Controller\DeleteImageController;
use UlasimInfo\UploadExif\Api\Controller\EditImageController; // YENİ EKLENDİ
use UlasimInfo\UploadExif\Api\Controller\GetWatermarksController;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__.'/js/dist/forum.js')
        ->css(__DIR__.'/resources/less/forum.less'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__.'/js/dist/admin.js'),

    (new Extend\Routes('api'))
        ->post('/spotter-upload', 'spotters.upload', UploadImageController::class)
        ->get('/spotter-image/{id}', 'spotters.show', ShowImageController::class)
        
        // --- EKLENEN KRİTİK ROTA (Profil Galerisi İçin) ---
        ->get('/spotter-images', 'spotters.images.list', ListImagesController::class)
        
        ->get('/spotter-images/all', 'spotters.admin.list', ListImagesController::class)
        ->get('/spotter-images/user', 'spotters.user.gallery', UserGalleryController::class)
        ->delete('/spotter-image/{id}', 'spotters.delete', DeleteImageController::class)
        // YENİ EKLENEN ROTA: Dosya Adı Düzenleme (PATCH)
        ->patch('/spotter-image/{id}', 'spotters.update', EditImageController::class)
        ->get('/spotter-watermarks', 'spotters.watermarks', GetWatermarksController::class),

    // --- YENİ EKLENEN KISIM: AYAR PAYLAŞIMI ---
    // Bu kısım, admin panelindeki EXIF ayarının ziyaretçilere de iletilmesini sağlar.
    (new Extend\Settings())
        ->serializeToForum('ulasiminfo-upload-exif.show_exif_publicly', 'ulasiminfo-upload-exif.show_exif_publicly'),
    // ------------------------------------------

    (new Extend\Formatter)
        ->configure(function (Configurator $config) {
            $config->BBCodes->addCustom(
                '[spotter-image id={NUMBER} url={URL} alt={TEXT}]',
                '<div class="spotter-image-container" data-id="{NUMBER}">
                    <div class="SpotterCard-image-wrapper">
                        <img src="{URL}" alt="{TEXT}" class="spotter-lazy" loading="lazy" />
                    </div>
                    <div class="spotter-exif-placeholder"></div>
                 </div>'
            );
            $config->BBCodes->addCustom(
                '[upl-image-preview uuid={TEXT1} url={URL} alt={TEXT2?}]',
                '<div class="fof-legacy-image"><img src="{URL}" alt="{TEXT2}" loading="lazy" style="max-width:100%;height:auto;" /></div>'
            );
        }),
];