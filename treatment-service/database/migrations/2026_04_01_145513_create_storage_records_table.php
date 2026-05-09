<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('storage_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('treatment_id')->constrained('treatment_protocols'); 
            $table->enum('storage_type', ['embryo', 'sperm', 'oocyte']); // Loại trữ đông
            $table->unsignedBigInteger('item_id'); // ID của phôi/tinh trùng/trứng cụ thể
            $table->string('item_type'); // Loại đối tượng (VD: blastocyst, sperm_sample, oocyte_batch)
            $table->date('start_date');            // Ngày bắt đầu trữ
            $table->date('expiry_date');           // Ngày hết hạn
            $table->enum('status', ['active', 'expired', 'released'])->default('active');
            $table->string('location_code');       // Mã bình nitơ (VD: TANK-A1)
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('storage_records');
    }
};