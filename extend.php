<?php

use Flarum\Extend;
use s9e\TextFormatter\Configurator;
use UlasimArsiv\UploadExif\Api\Controller\UploadImageController;
use UlasimArsiv\UploadExif\Api\Controller\ShowImageController;
use UlasimArsiv\UploadExif\Api\Controller\ListImagesController;
use UlasimArsiv\UploadExif\Api\Controller\UserGalleryController;
use UlasimArsiv\UploadExif\Api\Controller\DeleteImageController;
use UlasimArsiv\UploadExif\Api\Controller\EditImageController; // YENİ EKLENDİ
use UlasimArsiv\UploadExif\Api\Controller\GetWatermarksController;
use UlasimArsiv\UploadExif\Api\Controller\ListAdminWatermarksController;
use UlasimArsiv\UploadExif\Api\Controller\UploadWatermarkController;
use UlasimArsiv\UploadExif\Api\Controller\DeleteWatermarkController as AdminDeleteWatermarkController;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__.'/js/dist/forum.js')
        ->css(__DIR__.'/resources/less/forum.less'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__.'/js/dist/admin.js'),

    (new Extend\Routes('api'))
        ->post('/ulasimarsiv-upload', 'ulasimarsiv.upload', UploadImageController::class)
        ->get('/ulasimarsiv-image/{id}', 'ulasimarsiv.show', ShowImageController::class)
        
        // --- EKLENEN KRİTİK ROTA (Profil Galerisi İçin) ---
        ->get('/ulasimarsiv-images', 'ulasimarsiv.images.list', ListImagesController::class)
        
        ->get('/ulasimarsiv-images/all', 'ulasimarsiv.admin.list', ListImagesController::class)
        ->get('/ulasimarsiv-images/user', 'ulasimarsiv.user.gallery', UserGalleryController::class)
        ->delete('/ulasimarsiv-image/{id}', 'ulasimarsiv.delete', DeleteImageController::class)
        // YENİ EKLENEN ROTA: Dosya Adı Düzenleme (PATCH)
        ->patch('/ulasimarsiv-image/{id}', 'ulasimarsiv.update', EditImageController::class)
        ->get('/ulasimarsiv-watermarks', 'ulasimarsiv.watermarks', GetWatermarksController::class)
        
        // --- ADMIN WATERMARK YÖNETİMİ ---
        ->get('/ulasimarsiv-admin-watermarks', 'ulasimarsiv.admin.watermarks.list', ListAdminWatermarksController::class)
        ->post('/ulasimarsiv-admin-watermarks', 'ulasimarsiv.admin.watermarks.upload', UploadWatermarkController::class)
        ->post('/ulasimarsiv-admin-watermarks-delete', 'ulasimarsiv.admin.watermarks.delete', AdminDeleteWatermarkController::class),

    // --- YENİ EKLENEN KISIM: AYAR PAYLAŞIMI ---
    // Bu kısım, admin panelindeki EXIF ayarının ziyaretçilere de iletilmesini sağlar.
    (new Extend\Settings())
        ->serializeToForum('ulasimarsiv-upload-exif.show_exif_publicly', 'ulasimarsiv-upload-exif.show_exif_publicly'),
    // ------------------------------------------

    (new Extend\Formatter)
        ->configure(function (Configurator $config) {
            $config->BBCodes->addCustom(
                '[ulasimarsiv-image id={NUMBER} url={URL} alt={TEXT}]',
                '<div class="ulasimarsiv-image-container" data-id="{NUMBER}">
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