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
        Schema::create('treatment_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('protocol_id')->constrained('treatment_protocols')->onDelete('cascade');
            // Liên kết sự kiện này vào phác đồ nào
            $table->string('event_type'); // Loại sự kiện (Medication, Ultrasound, Lab Test)
            $table->string('title'); // Tiêu đề ngắn gọn của sự kiện
            $table->dateTime('event_datetime'); // Thời gian diễn ra sự kiện
            $table->text('result_summary')->nullable(); // Kết quả nhanh (ví dụ: kích thước trứng, liều thuốc đã tiêm)
            $table->string('location')->nullable(); // Nơi thực hiện (Phòng siêu âm, phòng Lab)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('treatment_events');
    }
};
