<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\NotificationTemplate;

class TemplateController extends Controller
{
    // Lấy danh sách tất cả các mẫu tin
    public function index()
    {
        $templates = NotificationTemplate::all();
        return response()->json(['success' => true, 'data' => $templates]);
    }

    // Tạo mới một mẫu tin
    public function store(Request $request)
    {
        $request->validate([
            'key' => 'required|string|unique:notification_templates,key',
            'content' => 'required|string'
        ]);

        $template = NotificationTemplate::create([
            'key' => $request->input('key'),
            'content' => $request->input('content')
        ]);

        return response()->json(['success' => true, 'message' => 'Tạo mẫu tin thành công!', 'data' => $template]);
    }
}