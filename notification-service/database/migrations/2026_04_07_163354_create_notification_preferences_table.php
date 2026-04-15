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
    Schema::create('notification_preferences', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('user_id')->unique(); // 1 User = 1 Cấu hình
        $table->boolean('appointment_reminder')->default(true);
        $table->boolean('treatment_reminder')->default(true);
        $table->boolean('system_notification')->default(true);
        $table->boolean('email_notification')->default(true);
        $table->boolean('sms_notification')->default(false); // Theo đúng hình là 0
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notification_preferences');
    }
};
