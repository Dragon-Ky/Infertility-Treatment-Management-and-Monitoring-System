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
        Schema::create('medication_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('schedule_id')->constrained('medication_schedules'); // Liên kết với lịch đã lên
            $table->dateTime('administered_at'); // Thời gian thực tế đã dùng thuốc
            $table->unsignedBigInteger('staff_id'); // Người thực hiện (Y tá hoặc BN tự xác nhận)
            $table->text('notes')->nullable(); // Phản ứng phụ hoặc ghi chú khác
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medication_records');
    }
};
