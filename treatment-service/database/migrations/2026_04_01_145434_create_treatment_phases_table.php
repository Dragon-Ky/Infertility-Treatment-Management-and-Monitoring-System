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
        Schema::create('treatment_phases', function (Blueprint $table) {
            $table->id();
            $table->foreignId('protocol_id')->constrained('treatment_protocols')->onDelete('cascade');
            // Khóa ngoại liên kết với bảng protocols. onDelete('cascade') nghĩa là xóa phác đồ thì xóa luôn giai đoạn này.
            $table->string('phase_name'); // Tên giai đoạn (Ví dụ: Ovarian Stimulation)
            $table->integer('order_index'); // Thứ tự của giai đoạn (1, 2, 3...)
            $table->text('description')->nullable(); // Mô tả chi tiết mục tiêu giai đoạn
            $table->enum('status', ['waiting', 'active', 'done'])->default('waiting'); // Trạng thái giai đoạn
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('treatment_phases');
    }
};
