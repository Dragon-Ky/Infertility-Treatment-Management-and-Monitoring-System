<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\DashboardService;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    protected DashboardService $dashboardService;

    public function __construct(DashboardService $dashboardService)
    {
        $this->dashboardService = $dashboardService;
    }

    public function getDoctorDashboard(Request $request)
    {
        // Lấy doctor ID từ user đã authenticate
        $doctorId = $request->user()?->id;

        if ($request->query('all') === 'true') {
            $doctorId = null;
        }

        $data = $this->dashboardService->getDashboardData($doctorId);

        return response()->json([
            'status' => 'success',
            'data' => $data
        ]);
    }
}
