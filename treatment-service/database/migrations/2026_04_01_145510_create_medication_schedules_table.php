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
            $table->foreignId('protocol_id')->constrained('treatment_protocols');
            $table->string('medicine_name'); // Tên thuốc
            $table->string('dosage'); // Liều lượng (VD: 225 IU, 2 viên)
            $table->dateTime('scheduled_at'); // Thời gian được chỉ định dùng thuốc
            $table->string('route'); // Đường dùng (Tiêm bắp, tiêm dưới da, uống)
            $table->timestamps();
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
