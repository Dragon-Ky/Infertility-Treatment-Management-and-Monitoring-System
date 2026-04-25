<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Exception;

class UserApiController extends Controller
{
    /**
     * Lấy danh sách Bác sĩ (Dành cho Admin và Manager)
     * Có Redis Cache để tối ưu hiệu năng
     */
    public function getDoctors()
    {
        try {
            // Lưu cache theo key riêng, thời gian 1 tiếng
            $doctors = Cache::remember('doctors_list', 3600, function () {
                return User::role('Doctor')
                    ->select('id', 'name', 'email', 'phone', 'avatar', 'status')
                    ->get();
            });

            return response()->json([
                'status' => 'success',
                'count'  => $doctors->count(),
                'data'   => $doctors
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không thể lấy danh sách bác sĩ',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Lấy danh sách Manager (Chỉ dành cho Admin tối cao)
     * Mới bổ sung theo cấu trúc 4 tầng
     */
    public function getManagers()
    {
        try {
            // Manager có thể thay đổi ít hơn nên cache lâu hơn chút
            $managers = Cache::remember('managers_list', 3600, function () {
                return User::role('Manager')
                    ->select('id', 'name', 'email', 'phone', 'avatar', 'status')
                    ->get();
            });

            return response()->json([
                'status' => 'success',
                'count'  => $managers->count(),
                'data'   => $managers
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không thể lấy danh sách quản lý (Manager)',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    /**
     * API Nội bộ: Lấy thông tin nhiều User theo danh sách ID
     */
    public function getUsersByIds(\Illuminate\Http\Request $request)
    {
        $ids = $request->input('ids');
        if (!$ids || !is_array($ids)) {
            return response()->json(['status' => 'error', 'message' => 'IDs are required'], 400);
        }

        $users = User::whereIn('id', $ids)
            ->select('id', 'name', 'email', 'avatar')
            ->get()
            ->keyBy('id');

        return response()->json([
            'status' => 'success',
            'data' => $users
        ]);
    }
}
