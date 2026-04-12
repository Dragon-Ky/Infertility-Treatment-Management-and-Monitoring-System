<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('embryo_records', function (Blueprint $table) {
            $table->id();
            // Liên kết với đợt điều trị (treatment_id)
            $table->foreignId('treatment_id')->constrained('treatment_protocols'); 
            $table->string('embryo_code')->unique(); // Mã định danh phôi (VD: P01)
            $table->date('fertilization_date');     // Ngày thụ tinh
            $table->enum('development_day', [3, 5, 6]); // Giai đoạn phát triển (Ngày 3, 5 hoặc 6)
            $table->string('grade');                // Chất lượng phôi (VD: 4AA, 3BB)
            $table->enum('status', ['frozen', 'transferred', 'discarded']); // Trạng thái phôi
            $table->text('notes')->nullable(); 
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('embryo_records');
    }
};