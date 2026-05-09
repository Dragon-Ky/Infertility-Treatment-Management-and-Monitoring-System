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
       Schema::table('treatment_protocols', function (Blueprint $table) {
        // Thêm cột price (lưu số tiền VNĐ, ví dụ 80000000), mặc định là 0
        $table->unsignedBigInteger('price')->default(0)->after('status');
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('treatment_protocols', function (Blueprint $table) {
        $table->dropColumn('price');
    });
    }
};
