<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\DashboardService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

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
            // 1. Tổng doanh thu (Cộng tất cả các ca đã completed)
            $totalRevenue = DB::table('synced_protocols')
                ->where('status', 'completed')
                ->sum('price');

            // 2. Tỉ lệ IVF thành công (Số ca completed / Tổng số ca)
            $completedCases = DB::table('synced_protocols')->where('status', 'completed')->count();
            $totalCases = DB::table('synced_protocols')->count();
            $successRate = $totalCases > 0 ? round(($completedCases / $totalCases) * 100) : 0;

            // 3. Đang điều trị
            $activeTreatments = DB::table('synced_protocols')->where('status', 'in_progress')->count();

            // 4. Tổng bệnh nhân
            $totalPatients = DB::table('synced_patients')->count();

            return response()->json([
                'success' => true,
                'data' => [
                    'overview' => [
                        'total_revenue' => (int) $totalRevenue,
                        'success_rate' => $successRate,
                        'active_treatments' => $activeTreatments,
                        'total_patients' => $totalPatients
                    ]
                ],
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
        // Quy về chung 1 hàm cho đồng bộ
        return $this->index();
    }
}
