<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Exception;

class ManagerController extends Controller
{
    /**
     * Lấy danh sách bác sĩ thuộc phạm vi quản lý
     */
    public function getDoctors()
    {
        try {
            $doctors = User::role('Doctor')
                ->select('id', 'name', 'email', 'phone', 'status', 'created_at')
                ->get();

            return response()->json([
                'status' => 'success',
                'data' => $doctors
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi khi lấy danh sách bác sĩ',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
