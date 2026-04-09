<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NotificationTemplate extends Model
{
    use HasFactory;

    // Cập nhật lại các cột theo chuẩn bảng notification_templates của v2
    protected $fillable = ['name', 'type', 'title_template', 'body_template', 'variables'];
    
    // Tự động chuyển chuỗi JSON trong DB thành mảng (array) khi code gọi ra
    protected $casts = [
        'variables' => 'array'
    ];
}