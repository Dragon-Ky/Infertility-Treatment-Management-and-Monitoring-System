<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('storage_records', function (Blueprint $blueprint) {
            // Thêm cột is_active nếu chưa có (Model đang mong đợi cột này)
            if (!Schema::hasColumn('storage_records', 'is_active')) {
                $blueprint->boolean('is_active')->default(true)->after('location_code');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('storage_records', function (Blueprint $blueprint) {
            if (Schema::hasColumn('storage_records', 'is_active')) {
                $blueprint->dropColumn('is_active');
            }
        });
    }
};
