<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('storage_records', function (Blueprint $table) {
            // 1. Thêm cột item_type để định danh loại Model (đa hình)
            if (!Schema::hasColumn('storage_records', 'item_type')) {
                $table->string('item_type')->after('item_id');
            }

            // 2. Chỉnh sửa expiry_date thành nullable (phôi có thể trữ vô thời hạn)
            $table->date('expiry_date')->nullable()->change();

            // 3. Ràng buộc UNIQUE để đảm bảo 1 phôi chỉ nằm ở 1 vị trí (Quan hệ 1-1)
            $table->unique(['item_id', 'item_type'], 'unique_storage_item');
        });
    }

    public function down(): void
    {
        Schema::table('storage_records', function (Blueprint $table) {
            $table->dropUnique('unique_storage_item');
            $table->dropColumn('item_type');
        });
    }
};