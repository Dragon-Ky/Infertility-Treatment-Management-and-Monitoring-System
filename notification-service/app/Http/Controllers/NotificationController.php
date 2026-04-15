<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\NotificationService;

class NotificationController extends Controller
{
    protected $notificationService;

    // Nhận bộ não NotificationService vào để sử dụng
    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * API 1: Mở cửa sổ nhận yêu cầu gửi thông báo từ Service khác
     */
    public function sendNotification(Request $request)
    {
        // 1. Kiểm tra xem service kia có gửi đủ thông tin không
        $request->validate([
            'userId' => 'required|integer',
            'templateKey' => 'required|string', // VD: 'NHAC_UONG_THUOC'
            'data' => 'nullable|array'          // VD: ['[name]' => 'Lan']
        ]);

        // 2. Chuyển thư cho "Bác bưu tá" (NotificationService) đi giao
        $success = $this->notificationService->sendPushNotification(
            $request->userId,
            $request->templateKey,
            $request->data ?? []
        );

        if ($success) {
            return response()->json(['success' => true, 'message' => 'Đã gửi thông báo qua Firebase thành công!']);
        }

        return response()->json(['success' => false, 'message' => 'Gửi thất bại (người dùng từ chối nhận hoặc lỗi Firebase)'], 500);
    }

    /**
     * API 2: Cửa sổ dành riêng cho Apache NiFi đến lấy báo cáo
     */
    public function dataForReport(Request $request)
    {
        // Service này chỉ đi giao thư, không có dữ liệu khám bệnh, nên trả về mảng rỗng chuẩn format
        return response()->json([
            "success" => true,
              "data" => [
                "records" => [], 
                "total" => 0,
                "syncedAt" => now()->toIso8601String()
            ]
        ]);
    }
}