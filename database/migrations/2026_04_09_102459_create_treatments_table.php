<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('treatments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id'); // ID bệnh nhân
            $table->unsignedBigInteger('doctor_id'); // Bác sĩ phụ trách chính
            $table->unsignedBigInteger('service_id'); // Liên kết tới dịch vụ (IUI/IVF gói cụ thể)
            
            // Bổ sung thêm tên loại điều trị để hiển thị nhanh không cần join bảng service liên tục
            $table->string('treatment_name')->nullable(); 
            
            $table->enum('treatment_type', ['iui', 'ivf', 'icsi', 'screening']); 
            $table->enum('status', ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'])->default('pending');
            
            $table->date('start_date');
            $table->date('expected_end_date')->nullable();
            $table->date('actual_end_date')->nullable(); // Thêm ngày kết thúc thực tế để báo cáo

            $table->decimal('total_cost', 15, 2)->default(0.00);
            $table->decimal('paid_amount', 15, 2)->default(0.00); // Thêm số tiền đã thanh toán để quản lý tài chính

            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('treatments');
    }
};