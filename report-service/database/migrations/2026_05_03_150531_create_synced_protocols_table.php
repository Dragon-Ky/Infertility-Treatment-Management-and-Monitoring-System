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
        Schema::create('synced_protocols', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('remote_id'); // ID của phác đồ bên nhà Treatment
        $table->string('status')->default('in_progress'); // Trạng thái (để vẽ biểu đồ tròn)
        $table->unsignedBigInteger('price')->default(0); // Tiền (để vẽ biểu đồ doanh thu)
        $table->timestamp('synced_at');
        $table->timestamps();
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('synced_protocols');
    }
};
