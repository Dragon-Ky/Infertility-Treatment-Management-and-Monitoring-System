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
        // Tui dùng bảng 'posts' để đồng bộ với PostSeeder ní đã viết
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->string('title');        // Tiêu đề bài viết
            $table->string('slug')->unique(); // Đường dẫn thân thiện (SEO)
            $table->text('content');       // Nội dung bài viết
            $table->string('image')->nullable(); // Ảnh đại diện bài viết

            // Liên kết trực tiếp với bảng users qua ID (Thay vì chỉ lưu tên string)
            $table->unsignedBigInteger('user_id');

            $table->integer('views')->default(0); // Lượt xem

            // Trạng thái: 0: Nháp, 1: Công khai, 2: Ẩn (Manager có thể dùng cái này để duyệt)
            $table->tinyInteger('status')->default(1);

            $table->timestamps(); 

            // Khóa ngoại: Khi xóa user, bài viết của họ cũng tự động xóa (cascade)
            $table->foreign('user_id')
                  ->references('id')
                  ->on('users')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
