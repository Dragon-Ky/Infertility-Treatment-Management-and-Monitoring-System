<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Cập nhật bảng medication_schedules
        Schema::table('medication_schedules', function (Blueprint $table) {
            if (!Schema::hasColumn('medication_schedules', 'is_active')) {
                $table->boolean('is_active')->default(true)->after('status');
            }
        });

        // Cập nhật bảng medication_records
        Schema::table('medication_records', function (Blueprint $table) {
            // Thêm cột is_active nếu chưa có
            if (!Schema::hasColumn('medication_records', 'is_active')) {
                $table->boolean('is_active')->default(true)->after('recorded_by');
            }

            // Làm cho actual_time có thể null (vì lúc lên lịch chưa uống ngay)
            $table->dateTime('actual_time')->nullable()->change();

            // Cấu hình lại khóa ngoại để có onDelete('cascade')
            $table->dropForeign(['medication_schedule_id']);
            $table->foreign('medication_schedule_id')
                ->references('id')->on('medication_schedules')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('medication_records', function (Blueprint $table) {
            $table->dropForeign(['medication_schedule_id']);
            $table->foreign('medication_schedule_id')->references('id')->on('medication_schedules');
            $table->dropColumn('is_active');
        });

        Schema::table('medication_schedules', function (Blueprint $table) {
            $table->dropColumn('is_active');
        });
    }
};