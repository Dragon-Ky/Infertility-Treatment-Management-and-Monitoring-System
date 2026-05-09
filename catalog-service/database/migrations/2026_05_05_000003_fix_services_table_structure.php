<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('services', function (Blueprint $table) {
            // Thêm cột icon nếu chưa có
            if (!Schema::hasColumn('services', 'icon')) {
                $table->string('icon')->nullable()->after('name');
            }
            
            // Thêm cột deleted_at nếu chưa có (để hỗ trợ SoftDeletes)
            if (!Schema::hasColumn('services', 'deleted_at')) {
                $table->softDeletes();
            }
        });
    }

    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->dropColumn(['icon', 'deleted_at']);
        });
    }
};
