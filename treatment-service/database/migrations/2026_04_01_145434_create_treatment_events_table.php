<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create('treatment_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('treatment_id')->constrained('treatment_protocols');
            $table->enum('event_type', ['egg_retrieval', 'embryo_transfer', 'insemination', 'ultrasound', 'blood_test', 'consultation', 'other']);
            $table->dateTime('event_date');
            $table->text('description')->nullable();
            $table->text('result')->nullable();
            $table->text('doctor_notes')->nullable();
            $table->json('attachments')->nullable(); // Lưu danh sách file/ảnh
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('treatment_events');
    }
};
