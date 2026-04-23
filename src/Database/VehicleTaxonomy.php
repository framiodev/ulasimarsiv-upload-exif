<?php

namespace UlasimArsiv\UploadExif\Database;

use Flarum\Database\AbstractModel;

class VehicleTaxonomy extends AbstractModel
{
    protected $table = 'arsv_vehicle_taxonomy';
    
    public $timestamps = true;
    
    protected $fillable = ['brand', 'model', 'type'];
}
