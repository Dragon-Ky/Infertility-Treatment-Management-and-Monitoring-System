<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
   public function up(): void
{
    // Bảng lưu thông tin bệnh nhân đã đồng bộ
    Schema::create('synced_patients', function (Blueprint $table) {
        $table->id();
        $table->integer('remote_id'); // ID bên Auth/Customer
        $table->string('name');
        $table->string('gender')->nullable();
        $table->timestamp('synced_at');
        $table->timestamps();
    });

    // Bảng lưu hiệu suất bác sĩ
    Schema::create('synced_doctors', function (Blueprint $table) {
        $table->id();
        $table->integer('doctor_id');
        $table->string('name');
        $table->integer('cases_count')->default(0);
        $table->timestamps();
    });
}
};
