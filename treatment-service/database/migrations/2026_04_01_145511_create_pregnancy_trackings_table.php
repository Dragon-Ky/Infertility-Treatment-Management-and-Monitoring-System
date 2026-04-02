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
        Schema::create('pregnancy_trackings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('protocol_id')->constrained('treatment_protocols');
            $table->decimal('beta_hcg_level', 8, 2)->nullable(); // Nồng độ Beta HCG
            $table->integer('gestational_age_weeks')->nullable(); // Tuổi thai (tuần)
            $table->string('fetal_heartbeat')->nullable(); // Tình trạng tim thai
            $table->enum('outcome', ['ongoing', 'miscarriage', 'live_birth', 'ectopic']); // Kết quả thai kỳ
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pregnancy_trackings');
    }
};
