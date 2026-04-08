<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pregnancy_trackings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('treatment_id')->constrained('treatment_protocols'); 
            $table->date('tracking_date'); // Ngày ghi nhận
            $table->integer('week_number'); // Thai nhi được bao nhiêu tuần
            $table->enum('status', ['ongoing', 'delivered', 'miscarried']); // Trạng thái: Đang phát triển, Đã sinh, Sảy thai
            $table->text('notes')->nullable(); 
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pregnancy_tracking');
    }
};