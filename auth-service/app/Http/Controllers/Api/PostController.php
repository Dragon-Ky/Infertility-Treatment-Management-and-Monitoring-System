<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Exception;

class PostController extends Controller
{
    /**
     * Lấy danh sách bài viết (Áp dụng Redis Cache)
     */
    public function index()
    {
        try {
            // Lấy từ Redis trong 10 phút.
            // Key 'blog_posts' sẽ chứa danh sách bài đã duyệt (status = 1)
            $posts = Cache::remember('blog_posts', 600, function () {
                return Post::with('user:id,name')
                    ->where('status', 1) // Chỉ lấy bài viết công khai
                    ->latest()
                    ->get();
            });

            return response()->json([
                'status' => 'success',
                'data' => $posts
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi khi tải bài viết',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Xem chi tiết bài viết (Có Cache theo ID)
     */
    public function show($id)
    {
        try {
            $post = Cache::remember("post_detail_{$id}", 600, function () use ($id) {
                return Post::with('user:id,name')->find($id);
            });

            if (!$post) {
                return response()->json(['status' => 'error', 'message' => 'Không tìm thấy bài viết'], 404);
            }

            // Tăng lượt xem
            $post->increment('views');

            return response()->json(['status' => 'success', 'data' => $post]);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Lỗi hệ thống'], 500);
        }
    }

    /**
     * Đăng bài viết mới (Admin / Manager / Doctor)
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required',
        ]);

        try {
            $post = Post::create([
                'title' => $request->title,
                'slug' => Str::slug($request->title) . '-' . time(),
                'content' => $request->content,
                'user_id' => auth('api')->id(),
                'image' => $request->image,
                'status' => 1, // Mặc định cho phép hiển thị
                'views' => 0
            ]);

            // Xóa Cache cũ để cập nhật danh sách mới
            $this->clearPostCache();

            return response()->json([
                'status' => 'success',
                'message' => 'Đăng bài viết thành công!',
                'data' => $post
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Đăng bài thất bại',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cập nhật bài viết
     */
    public function update(Request $request, $id)
    {
        $post = Post::find($id);
        if (!$post) return response()->json(['message' => 'Không thấy bài'], 404);

        // Logic check quyền: Admin/Manager sửa tất cả, Doctor chỉ sửa bài của mình
        $user = auth('api')->user();
        if (!$user->hasAnyRole(['Admin', 'Manager']) && $post->user_id !== $user->id) {
            return response()->json(['message' => 'Không có quyền sửa bài này'], 403);
        }

        $post->update($request->only(['title', 'content', 'image', 'status']));

        // Làm mới cache
        $this->clearPostCache($id);

        return response()->json(['status' => 'success', 'message' => 'Đã cập nhật bài viết']);
    }

    /**
     * Xóa bài viết
     */
    public function destroy($id)
    {
        $post = Post::find($id);
        if (!$post) return response()->json(['message' => 'Không thấy bài'], 404);

        $post->delete();
        $this->clearPostCache($id);

        return response()->json(['status' => 'success', 'message' => 'Đã xóa bài viết']);
    }

    /**
     * Helper dọn dẹp Cache bài viết
     */
    private function clearPostCache($id = null)
    {
        Cache::forget('blog_posts');
        if ($id) {
            Cache::forget("post_detail_{$id}");
        }
    }
}
