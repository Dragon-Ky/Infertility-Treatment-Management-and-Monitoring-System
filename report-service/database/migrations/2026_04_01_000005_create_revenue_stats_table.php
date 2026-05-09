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
        Schema::create('revenue_stats', function (Blueprint $table) {
            $table->id();
            $table->string('period');
            $table->string('service_type')->nullable();
            $table->decimal('total_revenue', 15, 2)->default(0);
            $table->integer('total_treatments')->default(0);
            $table->integer('successful_treatments')->default(0);
            $table->decimal('success_rate', 5, 2)->default(0);
            $table->timestamps();

            $table->index(['period', 'service_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('revenue_stats');
    }
};
