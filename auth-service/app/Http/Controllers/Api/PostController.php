<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class PostController extends Controller
{

    //  Lấy danh sách bài viết (áp dụng Redis Cache)

    public function index()
    {
        // Thử lấy dữ liệu từ Redis với key 'blog_posts'
        // Nếu không có, sẽ chạy hàm callback để lấy từ DB và lưu vào Redis trong 10 phút (600 giây)
        $posts = Cache::remember('blog_posts', 600, function () {
            return Post::with('user:id,name')->latest()->get();
        });

        return response()->json([
            'status' => 'success',
            'data' => $posts
        ]);
    }

    /**
     * Xem chi tiết 1 bài viết (Có Cache theo ID)
     */
    public function show($id)
    {
        $post = Cache::remember("post_detail_{$id}", 600, function () use ($id) {
            return Post::with('user:id,name')->find($id);
        });

        if (!$post) {
            return response()->json(['status' => 'error', 'message' => 'Không tìm thấy bài viết'], 404);
        }

        return response()->json(['status' => 'success', 'data' => $post]);
    }

    /**
     * Đăng bài viết mới (Chỉ Doctor/Admin)
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required',
        ]);

        $post = Post::create([
            'title' => $request->title,
            'slug' => Str::slug($request->title) . '-' . time(),
            'content' => $request->content,
            'user_id' => auth('api')->id(),
            'image' => $request->image,
        ]);

        // Xóa Cache cũ để người dùng thấy bài viết mới ngay lập tức
        Cache::forget('blog_posts');

        return response()->json([
            'status' => 'success',
            'message' => 'Đăng bài viết thành công!',
            'data' => $post
        ], 201);
    }
}
