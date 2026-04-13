<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('specimen_records', function (Blueprint $table) {
            $table->id();
            // Liên kết với quá trình điều trị
            $table->foreignId('treatment_id')->constrained('treatment_protocols'); 
            
            // Phân loại: Phôi, Trứng, hoặc Tinh trùng
            $table->enum('type', ['embryo', 'egg', 'sperm'])->default('embryo');

            // Mã định danh dùng chung
            $table->string('specimen_code')->unique(); // VD: EB-01, SP-01, EG-01
            
            // Các thuộc tính tuỳ chọn (Chỉ bắt buộc với Phôi, còn trứng/tinh trùng thì null)
            $table->date('fertilization_date')->nullable();
            $table->enum('development_day', [3, 5, 6])->nullable(); 
            $table->string('grade')->nullable(); // Chất lượng phôi/trứng/tinh trùng
            
            $table->enum('status', ['fresh', 'frozen', 'used', 'discarded'])->default('fresh');
            $table->text('notes')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('specimen_records');
    }
};
