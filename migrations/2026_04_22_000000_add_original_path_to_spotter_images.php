<?php
use Illuminate\Database\Schema\Blueprint;
use Flarum\Database\Migration;

return Migration::addColumns('spotter_images', [
    'original_path' => ['string', 'length' => 255, 'nullable' => true],
]);
