<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        if ($schema->hasTable('arsv_vehicle_taxonomy')) {
            $schema->table('arsv_vehicle_taxonomy', function (Blueprint $table) {
                if (!$table->hasColumn('discussion_id')) {
                    $table->integer('discussion_id')->nullable()->after('type');
                }
            });
        }
    },
    'down' => function (Builder $schema) {
        if ($schema->hasTable('arsv_vehicle_taxonomy')) {
            $schema->table('arsv_vehicle_taxonomy', function (Blueprint $table) {
                if ($table->hasColumn('discussion_id')) {
                    $table->dropColumn('discussion_id');
                }
            });
        }
    }
];
