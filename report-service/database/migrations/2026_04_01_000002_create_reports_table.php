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
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('type', [
                'treatment_success',
                'revenue',
                'patient',
                'doctor',
                'monthly',
                'yearly'
            ]);
            $table->json('parameters')->nullable();
            $table->unsignedBigInteger('generated_by')->nullable();
            $table->string('file_path')->nullable();
            $table->enum('status', ['generating', 'ready', 'failed'])->default('generating');
            $table->timestamps();

            $table->index(['type', 'status']);
            $table->index('generated_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
