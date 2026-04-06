<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Exception; 

class DoctorController extends Controller
{
    /**
     * Lấy danh sách tất cả bệnh nhân (Dành cho Dashboard Bác sĩ)
     */
    public function index()
    {
        try {
            $patients = User::role('Patient')
                ->select('id', 'name', 'email', 'phone', 'created_at')
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'status' => 'success',
                'count'  => $patients->count(),
                'data'   => $patients
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi hệ thống khi lấy danh sách bệnh nhân',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Xem chi tiết hồ sơ một bệnh nhân
     */
    public function show($id)
    {
        try {
            $patient = User::role('Patient')->find($id);

            if (!$patient) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Không tìm thấy bệnh nhân hoặc người dùng không có quyền bệnh nhân'
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'data' => $patient
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi khi truy xuất thông tin bệnh nhân',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
