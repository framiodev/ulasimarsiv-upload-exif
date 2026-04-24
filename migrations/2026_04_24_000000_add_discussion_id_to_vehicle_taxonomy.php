<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        if ($schema->hasTable('arsv_vehicle_taxonomy') && !$schema->hasColumn('arsv_vehicle_taxonomy', 'discussion_id')) {
            $schema->table('arsv_vehicle_taxonomy', function (Blueprint $table) {
                $table->integer('discussion_id')->nullable()->after('type');
            });
        }
    },
    'down' => function (Builder $schema) {
        if ($schema->hasTable('arsv_vehicle_taxonomy') && $schema->hasColumn('arsv_vehicle_taxonomy', 'discussion_id')) {
            $schema->table('arsv_vehicle_taxonomy', function (Blueprint $table) {
                $table->dropColumn('discussion_id');
            });
        }
    }
];
