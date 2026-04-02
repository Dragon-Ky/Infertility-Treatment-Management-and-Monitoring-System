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
        Schema::create('treatment_notes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('protocol_id')->constrained('treatment_protocols')->onDelete('cascade');
            $table->unsignedBigInteger('author_id'); // ID của người viết ghi chú (Bác sĩ/Y tá)
            $table->text('content'); // Nội dung ghi chú chi tiết về tình trạng bệnh nhân
            $table->boolean('is_urgent')->default(false); // Đánh dấu nếu đây là ghi chú khẩn cấp
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('treatment_notes');
    }
};
