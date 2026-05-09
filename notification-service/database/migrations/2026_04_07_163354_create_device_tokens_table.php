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
    Schema::create('device_tokens', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('user_id')->index(); // Không dùng foreign() vì khác Database
        $table->string('token')->unique(); // FCM/APNs Token
        $table->boolean('is_active')->default(true);
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('device_tokens');
    }
};
