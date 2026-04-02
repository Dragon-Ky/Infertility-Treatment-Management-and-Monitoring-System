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
        Schema::create('storage_records', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('patient_id'); // Chủ sở hữu mẫu
            $table->string('sample_type'); // Loại mẫu (Embryo, Egg, Sperm)
            $table->string('tank_location'); // Vị trí bình chứa (VD: Bình A, Rack 2)
            $table->date('freeze_date'); // Ngày bắt đầu trữ đông
            $table->date('expiration_date'); // Ngày hết hạn lưu trữ/đóng phí
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('storage_records');
    }
};
