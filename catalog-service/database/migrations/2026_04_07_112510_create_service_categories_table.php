<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_categories', function (Blueprint $table) {
            $table->id();

            // =========================
            //SỬA chống duplicate IVF / IUI
            // =========================
            $table->string('name')->unique();

            // =========================
            // SỬA KHÔNG cho NULL để tránh dữ liệu bẩn
            // =========================
            $table->text('description');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('service_categories');
    }
};