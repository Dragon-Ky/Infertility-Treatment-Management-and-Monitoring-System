<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BlogController extends Controller
{
    public function index()
    {
        $blogs = Blog::with('category')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $blogs
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id'     => 'required|integer',
            'category_id' => 'nullable|exists:blog_categories,id',
            'title'       => 'required|string|max:255',
            'content'     => 'required|string',
            'thumbnail'   => 'nullable|string',
            'status'      => 'in:draft,published',
        ]);

        $blog = Blog::create([
            'user_id'     => $request->user_id,
            'category_id' => $request->category_id,
            'title'       => $request->title,
            'slug'        => Str::slug($request->title) . '-' . time(),
            'content'     => $request->content,
            'thumbnail'   => $request->thumbnail,
            'status'      => $request->status ?? 'draft',
            'views'       => 0,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Blog created successfully',
            'data'    => $blog->load('category')
        ], 201);
    }

    public function show($id)
    {
        $blog = Blog::with('category')->find($id);

        if (!$blog) {
            return response()->json([
                'success' => false,
                'message' => 'Blog not found'
            ], 404);
        }

        // Tăng view mỗi lần xem
        $blog->increment('views');

        return response()->json([
            'success' => true,
            'data'    => $blog
        ]);
    }

    public function update(Request $request, $id)
    {
        $blog = Blog::find($id);

        if (!$blog) {
            return response()->json([
                'success' => false,
                'message' => 'Blog not found'
            ], 404);
        }

        $request->validate([
            'category_id' => 'nullable|exists:blog_categories,id',
            'title'       => 'sometimes|string|max:255',
            'content'     => 'sometimes|string',
            'thumbnail'   => 'nullable|string',
            'status'      => 'in:draft,published',
        ]);

        $blog->update($request->only([
            'category_id',
            'title',
            'content',
            'thumbnail',
            'status',
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Blog updated successfully',
            'data'    => $blog->load('category')
        ]);
    }

    public function destroy($id)
    {
        $blog = Blog::find($id);

        if (!$blog) {
            return response()->json([
                'success' => false,
                'message' => 'Blog not found'
            ], 404);
        }

        $blog->delete();

        return response()->json([
            'success' => true,
            'message' => 'Blog deleted successfully'
        ]);
    }

    
    public function published()
    {
        $blogs = Blog::with('category')
            ->where('status', 'published')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $blogs
        ]);
    }
}