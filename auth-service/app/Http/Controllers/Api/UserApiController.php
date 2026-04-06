<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Cache;

class UserApiController extends Controller
{
    public function getDoctors()
    {
        // Lưu danh sách bác sĩ vào Redis trong 1 tiếng (3600 giây)
        $doctors = Cache::remember('doctors_list', 3600, function () {
            return User::role('Doctor')->get();
        });

        return response()->json([
            'status' => 'success',
            'data' => $doctors
        ]);
    }
}
