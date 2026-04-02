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
        Schema::create('lab_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('protocol_id')->constrained('treatment_protocols');
            $table->string('test_name'); // Tên xét nghiệm (VD: AMH, LH, Estradiol)
            $table->string('result_value'); // Giá trị kết quả
            $table->string('unit'); // Đơn vị đo (VD: ng/ml, mIU/mL)
            $table->text('interpretation')->nullable(); // Đánh giá của bác sĩ lab
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lab_results');
    }
};
