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
        Schema::create('treatment_stats', function (Blueprint $table) {
            $table->id();
            $table->string('period');
            $table->string('treatment_type')->nullable();
            $table->integer('total_cases')->default(0);
            $table->integer('completed')->default(0);
            $table->integer('in_progress')->default(0);
            $table->integer('cancelled')->default(0);
            $table->decimal('success_rate', 5, 2)->default(0);
            $table->timestamps();

            $table->index(['period', 'treatment_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('treatment_stats');
    }
};
