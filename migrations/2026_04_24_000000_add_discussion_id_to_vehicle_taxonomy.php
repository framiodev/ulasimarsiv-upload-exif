<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        if ($schema->hasTable('vehicle_taxonomy') && !$schema->hasColumn('vehicle_taxonomy', 'discussion_id')) {
            $schema->table('vehicle_taxonomy', function (Blueprint $table) {
                $table->integer('discussion_id')->nullable()->after('type');
            });
        }
    },
    'down' => function (Builder $schema) {
        if ($schema->hasTable('vehicle_taxonomy') && $schema->hasColumn('vehicle_taxonomy', 'discussion_id')) {
            $schema->table('vehicle_taxonomy', function (Blueprint $table) {
                $table->dropColumn('discussion_id');
            });
        }
    }
];
