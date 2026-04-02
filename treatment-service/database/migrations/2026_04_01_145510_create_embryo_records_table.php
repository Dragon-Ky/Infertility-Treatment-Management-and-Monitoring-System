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
        Schema::create('embryo_records', function (Blueprint $table) {
            $table->id(); // Khóa chính
            $table->foreignId('protocol_id')->constrained('treatment_protocols'); // Liên kết với phác đồ
            $table->string('embryo_code'); // Mã định danh phôi (VD: P01, P02)
            $table->string('stage'); // Giai đoạn (Ngày 3, Ngày 5)
            $table->string('grade'); // Chất lượng phôi (VD: 4AA, 3BB)
            $table->enum('status', ['fresh', 'frozen', 'transferred', 'discarded']); // Trạng thái phôi
            $table->timestamps(); // Thời gian tạo/cập nhật
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('embryo_records');
    }
};
