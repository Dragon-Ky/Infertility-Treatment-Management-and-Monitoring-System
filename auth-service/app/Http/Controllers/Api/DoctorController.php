<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Exception;

class DoctorController extends Controller
{
    /**
     * Lấy danh sách tất cả khách hàng
     * Dành cho: Doctor Dashboard, Manager giám sát, Admin quản trị
     */
    public function index()
    {
        try {
            // Lấy danh sách user có role là Customer
            $customers = User::role('Customer')
                ->select('id', 'name', 'email', 'phone', 'avatar', 'status', 'created_at')
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'status' => 'success',
                'count'  => $customers->count(),
                'data'   => $customers
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống khi lấy danh sách khách hàng',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Xem chi tiết hồ sơ một khách hàng
     */
    public function show($id)
    {
        try {
            // Tìm user có ID cụ thể và phải có role là Customer
            $customer = User::role('Customer')->find($id);

            if (!$customer) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Không tìm thấy khách hàng hoặc người dùng không có quyền hợp lệ'
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'data' => $customer
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi khi truy xuất thông tin khách hàng',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cập nhật thông tin khách hàng (Dành cho bác sĩ ghi chú)
     * Thêm hàm này để bác sĩ có thể làm việc trên dữ liệu khách hàng
     */
    public function updateTreatment(Request $request)
    {
        // Logic xử lý cập nhật phác đồ hoặc ghi chú y tế ở đây
        // Có thể mở rộng tùy theo yêu cầu của bài Treatment Plan
        return response()->json([
            'status' => 'success',
            'message' => 'Tính năng cập nhật đang được đồng bộ với Treatment Service'
        ]);
    }
}
