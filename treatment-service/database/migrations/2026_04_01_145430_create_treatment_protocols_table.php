<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('treatment_protocols', function (Blueprint $table) {
            $table->id(); // Khởi tạo khóa chính id
            $table->unsignedBigInteger('treatment_id'); // ID của đợt điều trị
            $table->unsignedBigInteger('doctor_id');    // ID bác sĩ phụ trách
            $table->string('protocol_name');           // Tên phác đồ
            $table->text('diagnosis')->nullable();      // Chẩn đoán
            $table->text('prescription')->nullable();   // Đơn thuốc
            $table->text('notes')->nullable();          // Ghi chú thêm
            $table->timestamps(); // Tạo created_at và updated_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('treatment_protocols');
    }
};