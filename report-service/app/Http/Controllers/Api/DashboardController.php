<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\DashboardService;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    protected $dashboardService;

    public function __construct(DashboardService $dashboardService)
    {
        $this->dashboardService = $dashboardService;
    }

    /**
     * Get dashboard data.
     */
    public function index(): JsonResponse
    {
        try {
            $data = $this->dashboardService->getDashboardData();
            return response()->json([
                'success' => true,
                'data' => $data,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load dashboard data',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get system overview.
     */
    public function overview(): JsonResponse
    {
        try {
            $overview = $this->dashboardService->getSystemOverview();
            return response()->json([
                'success' => true,
                'data' => $overview,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load system overview',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
