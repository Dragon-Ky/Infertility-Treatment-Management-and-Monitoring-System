<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use Illuminate\Http\Request;

class BlogController extends Controller
{
    // Xem danh sách bài viết
    public function index() {
        $blogs = Blog::latest()->get();
        return view('blog.index', compact('blogs'));
    }

    // Trang tạo bài viết mới (Chỉ Doctor/Admin)
    public function create() {
        return view('blog.create');
    }

    // Lưu bài viết vào Database
    public function store(Request $request) {
        $request->validate([
            'title' => 'required',
            'content' => 'required',
        ]);

        Blog::create([
            'title' => $request->title,
            'content' => $request->content,
            'author_name' => auth()->user()->name,
        ]);

        return redirect()->route('blog.index')->with('success', 'Đăng bài thành công!');
    }
}
