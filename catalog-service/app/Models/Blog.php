<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes; 

class Blog extends Model
{
    use HasFactory, SoftDeletes; 
    protected $fillable = [
        'user_id',
        'category_id',
        'title',
        'slug',
        'content',
        'thumbnail',
        'status',
        'views',
    ];

    public function category()
    {
        return $this->belongsTo(BlogCategory::class, 'category_id');
    }
}