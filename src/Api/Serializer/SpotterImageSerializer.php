<?php

namespace UlasimArsiv\UploadExif\Api\Serializer;

use Flarum\Api\Serializer\AbstractSerializer;
use Flarum\Api\Serializer\UserSerializer;

class SpotterImageSerializer extends AbstractSerializer
{
    // API'de bu nesnenin türü ne olacak?
    protected $type = 'ulasimarsiv-images';

    // Admin paneline gönderilecek veriler
    protected function getDefaultAttributes($model)
    {
        return [
            'id'         => $model->id,
            'filename'   => $model->filename,
            'url'        => $model->path,       // Tam resim yolu
            'thumb_path' => $model->thumb_path, // Küçük resim yolu
            'original_path' => $model->original_path ?? null, // Orijinal imzasız resim
            'createdAt'  => $this->formatDate($model->created_at),
        ];
    }

    // İlişkiler: Resmi kim yükledi?
    public function user($model)
    {
        return $this->hasOne($model, UserSerializer::class);
    }
}