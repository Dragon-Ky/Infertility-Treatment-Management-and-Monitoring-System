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
        Schema::create('blogs', function (Blueprint $table) {
        $table->id();
        $table->string('title');        // Tiêu đề bài viết
        $table->text('content');        // Nội dung chi tiết
        $table->string('author_name');  // Tên bác sĩ hoặc người đăng bài
        $table->timestamps();           // Ngày đăng và cập nhật
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blogs');
    }
};
