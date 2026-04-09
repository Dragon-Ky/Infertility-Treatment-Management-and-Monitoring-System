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
        Schema::create('treatments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id'); // ID bệnh nhân
            $table->unsignedBigInteger('doctor_id'); // Bác sĩ phụ trách
            $table->unsignedBigInteger('service_id'); 
            $table->enum('treatment_type', ['iui', 'ivf']); // [cite: 13]
            $table->enum('status', ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'])->default('pending'); // [cite: 38]
            $table->date('start_date');
            $table->date('expected_end_date')->nullable();
            $table->decimal('total_cost', 15, 2);
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('treatments');
    }
};
