<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class DoctorController extends Controller
{
    public function index()
    {
        try {
            $patients = User::role('Patient')
                ->select('id', 'name', 'email', 'phone', 'created_at')
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'status' => 'success',
                'data' => $patients
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không thể lấy danh sách bệnh nhân',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function show($id)
    {

        $patient = User::role('Patient')->find($id);

        if (!$patient) {
            return response()->json([
                'status' => 'error',
                'message' => 'Không tìm thấy bệnh nhân'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $patient
        ], 200);
    }
}
