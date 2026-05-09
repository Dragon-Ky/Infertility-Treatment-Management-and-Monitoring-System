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
        Schema::create('medication_schedules', function (Blueprint $table) {
            $table->id();
            // Liên kết với bảng phác đồ điều trị (treatment_protocols)
            $table->foreignId('treatment_id')->constrained('treatment_protocols');
            
            $table->string('medication_name'); // Tên thuốc
            $table->string('dosage');          // Liều lượng (VD: 225 IU, 2 viên)
            $table->string('frequency');       // Tần suất (VD: Hàng ngày, Cách ngày)
            
            $table->date('start_date');        // Ngày bắt đầu uống thuốc
            $table->date('end_date');          // Ngày kết thúc uống thuốc
            
            // Lưu danh sách các khung giờ dùng thuốc trong ngày (Dạng JSON/Array)
            $table->json('time_slots');        
            
            // Đường dùng thuốc (Tiêm, Uống, Đặt âm đạo, Khác)
            $table->enum('route', ['injection', 'oral', 'vaginal', 'other']);
            
            // Trạng thái lịch trình: Đang hoạt động, Hoàn thành, Tạm dừng
            $table->enum('status', ['active', 'completed', 'paused'])->default('active');
            
            $table->timestamps(); // created_at và updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medication_schedules');
    }
};