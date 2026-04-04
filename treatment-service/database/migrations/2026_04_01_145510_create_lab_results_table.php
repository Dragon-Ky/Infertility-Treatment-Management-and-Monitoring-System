<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lab_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('treatment_id')->constrained('treatment_protocols');
            // Loại xét nghiệm: Máu, Siêu âm, Hormone, Tinh dịch đồ, Khác
            $table->enum('test_type', ['blood', 'ultrasound', 'hormone', 'spermogram', 'other']);
            $table->dateTime('test_date'); // Ngày làm xét nghiệm
            $table->json('result_data');   // Lưu các chỉ số phức tạp dưới dạng JSON
            $table->string('reference_range')->nullable(); // Khoảng tham chiếu an toàn
            $table->string('unit')->nullable();            // Đơn vị đo
            $table->text('notes')->nullable();             // Ghi chú chung
            $table->text('doctor_notes')->nullable();      // Đánh giá chuyên môn của bác sĩ
            $table->json('attachments')->nullable();       // Danh sách file đính kèm (ảnh siêu âm, PDF...)
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lab_results');
    }
};