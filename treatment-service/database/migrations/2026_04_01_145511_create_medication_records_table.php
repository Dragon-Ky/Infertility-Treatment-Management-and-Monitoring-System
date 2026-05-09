<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('medication_records', function (Blueprint $table) {
            $table->id();
            // Liên kết tới bảng lịch trình thuốc
            $table->foreignId('medication_schedule_id')->constrained('medication_schedules'); 
            $table->dateTime('scheduled_time'); // Thời gian dự kiến uống thuốc
            $table->dateTime('actual_time');    // Thời gian thực tế đã uống
            $table->enum('status', ['taken', 'missed', 'skipped']); // Trạng thái: Đã uống, Bỏ lỡ, Bỏ qua
            $table->text('notes')->nullable(); 
            $table->unsignedBigInteger('recorded_by'); // ID người ghi nhận (Y tá/Bệnh nhân)
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('medication_records');
    }
};