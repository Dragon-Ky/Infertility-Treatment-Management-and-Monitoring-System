<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('treatment_protocols', function (Blueprint $table) {
            $table->id(); // Khởi tạo khóa chính ID (bigint, auto-increment)
            $table->unsignedBigInteger('patient_id'); // Lưu ID bệnh nhân (liên kết từ Patient Service)
            $table->unsignedBigInteger('doctor_id'); // Lưu ID bác sĩ phụ trách
            $table->string('name'); // Tên phác đồ (Ví dụ: IVF phác đồ dài, IUI...)
            $table->date('start_date')->nullable(); // Ngày bắt đầu điều trị
            $table->date('end_date')->nullable(); // Ngày kết thúc dự kiến hoặc thực tế
            $table->enum('status', ['pending', 'in_progress', 'completed', 'cancelled'])->default('pending'); 
            // Trạng thái điều trị: Chờ, Đang tiến hành, Hoàn thành, Đã hủy
            $table->timestamps(); // Tạo 2 cột created_at (thời điểm tạo) và updated_at (thời điểm cập nhật)
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('treatment_protocols'); // Xóa bảng nếu cần rollback (hoàn tác)
    }

};
