<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('treatment_protocols', function (Blueprint $table) {
            // Thêm cột status, mặc định là in_progress
            $table->enum('status', ['in_progress', 'completed', 'cancelled', 'failed'])
                  ->default('in_progress')
                  ->after('is_active');
        });
    }

    public function down(): void
    {
        Schema::table('treatment_protocols', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
};
