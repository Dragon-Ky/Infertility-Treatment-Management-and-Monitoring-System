<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'content',
        'image',
        'user_id',
    ];

    /**
     * Định nghĩa quan hệ: Một bài viết thuộc về một người dùng (Bác sĩ/Admin)
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
