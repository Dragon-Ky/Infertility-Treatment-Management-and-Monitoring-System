<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     * Lệnh này chạy khi bạn gõ php artisan migrate
     */
    public function up(): void
    {
        // Danh sách 10 bảng dữ liệu của bạn
        $tables = [
            'treatment_protocols',
            'treatment_events',
            'treatment_phases',
            'treatment_notes',
            'lab_results',
            'medication_schedules',
            'medication_records',
            'pregnancy_trackings',
            'storage_records'
        ];

        foreach ($tables as $tableName) {
            Schema::table($tableName, function (Blueprint $table) {
                // 1. Biến kiểm tra xóa: true là còn, false là đã xóa
                $table->boolean('is_active')->default(true)->after('id');

            });
        }
    }

    /**
     * Reverse the migrations.
     * Lệnh này chạy khi bạn muốn hủy bỏ (Rollback)
     */
    public function down(): void
    {
        $tables = [
            'treatment_protocols',
            'treatment_events',
            'treatment_phases',
            'treatment_notes',
            'lab_results',
            'medication_schedules',
            'medication_records',
            'pregnancy_trackings',
            'storage_records'
        ];

        foreach ($tables as $tableName) {
            Schema::table($tableName, function (Blueprint $table) {
                // Xóa 2 cột này đi nếu muốn quay lại trạng thái cũ
                $table->dropColumn(['is_active']);
            });
        }
    }
};