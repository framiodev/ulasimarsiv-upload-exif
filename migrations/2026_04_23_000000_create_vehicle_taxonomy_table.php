<?php

use Illuminate\Database\Schema\Blueprint;
use Flarum\Database\Migration;

return Migration::createTable('arsv_vehicle_taxonomy', function (Blueprint $table) {
    $table->increments('id');
    $table->string('brand', 100);
    $table->string('model', 100);
    $table->string('type', 50)->default('bus'); // bus, truck vb.
    $table->timestamps();
    
    $table->index(['brand', 'model']);
});
