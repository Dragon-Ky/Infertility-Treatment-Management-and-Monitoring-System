<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Exception;

class DoctorController extends Controller
{
    /**
     * Lấy danh sách tất cả khách hàng (Dành cho Dashboard Bác sĩ)
     */
    public function index()
    {
        try {
            $customers = User::role('Customer')
                ->select('id', 'name', 'email', 'phone', 'created_at')
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
            $customers = User::role('Customer')->find($id);

            if (!$customers) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Không tìm thấy khách hàng hoặc người dùng không có quyền khách hàng'
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'data' => $customers
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi khi truy xuất thông tin khách hàng',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
