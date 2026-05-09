<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('reminder_schedules', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('user_id')->index();
        $table->unsignedBigInteger('treatment_id')->nullable()->index();
        $table->enum('reminder_type', ['medication', 'appointment', 'test']);
        $table->dateTime('scheduled_time');
        $table->enum('status', ['pending', 'sent', 'cancelled'])->default('pending');
        $table->unsignedBigInteger('notification_id')->nullable()->index();
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reminder_schedules');
    }
};