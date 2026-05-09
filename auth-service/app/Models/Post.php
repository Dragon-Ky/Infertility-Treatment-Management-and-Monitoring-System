<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    /**
     * Các thuộc tính có thể gán hàng loạt.
     * Bổ sung 'status', 'views' và 'excerpt' để khớp với Migration tối ưu.
     */
    protected $fillable = [
        'title',
        'slug',
        'content',
        'excerpt', // Mô tả ngắn cho SEO/Danh sách
        'image',
        'user_id',
        'status',  // 0: Nháp, 1: Công khai, 2: Ẩn
        'views',
    ];

    /**
     * Ép kiểu dữ liệu
     */
    protected $casts = [
        'status' => 'integer',
        'views'  => 'integer',
    ];

    /**
     * Định nghĩa quan hệ: Một bài viết thuộc về một người dùng (Admin/Manager/Doctor)
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * --- SCOPES (Hàm lọc nhanh) ---
     * Giúplấy bài viết công khai cực nhanh: Post::published()->get();
     */
    public function scopePublished($query)
    {
        return $query->where('status', 1);
    }

    /**
     * --- HÀM TIỆN ÍCH ---
     */

    // Kiểm tra bài viết có phải bản nháp không
    public function isDraft()
    {
        return $this->status === 0;
    }

    // Kiểm tra bài viết có đang công khai không
    public function isPublished()
    {
        return $this->status === 1;
    }
}
