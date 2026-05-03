<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ReportService;
use App\Services\StatisticsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    protected $reportService;
    protected $statisticsService;

    public function __construct(ReportService $reportService, StatisticsService $statisticsService)
    {
        $this->reportService = $reportService;
        $this->statisticsService = $statisticsService;
    }

    /**
     * API Trạng thái phác đồ (Biểu đồ Tròn)
     */
    public function treatmentSuccess(Request $request): JsonResponse
    {
        try {
            $period = $request->get('period', now()->format('Y-m')); // Lọc theo tháng YYYY-MM

            // Đếm số lượng theo từng trạng thái (completed, in_progress...)
            $stats = DB::table('synced_protocols')
                ->selectRaw('status as name, count(*) as total')
                ->whereRaw("DATE_FORMAT(created_at, '%Y-%m') = ?", [$period])
                ->groupBy('status')
                ->get();

            // Format lại data cho đúng với Recharts
            $formattedData = [];
            foreach ($stats as $stat) {
                $formattedData[$stat->name] = $stat->total;
            }

            if (empty($formattedData)) {
                $formattedData = ['Chưa có dữ liệu' => 1]; // Tránh lỗi trắng biểu đồ
            }

            return response()->json(['success' => true, 'data' => $formattedData]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * API Doanh thu (Biểu đồ Cột)
     */
    public function revenue(Request $request): JsonResponse
    {
        try {
            $period = $request->get('period', now()->format('Y-m'));


            $totalRevenue = DB::table('synced_protocols')
                ->where('status', 'completed')
                ->whereRaw("DATE_FORMAT(created_at, '%Y-%m') = ?", [$period])
                ->sum('price');

            $data = [
                'Doanh thu IVF' => $totalRevenue * 0.8,
                'Dịch vụ IUI' => $totalRevenue * 0.1,
                'Khám & Xét nghiệm' => $totalRevenue * 0.1,
            ];

            return response()->json(['success' => true, 'data' => $data]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * API Thống kê Bệnh nhân
     */
    public function patients(Request $request)
    {
        try {
            // Đếm số lượng bệnh nhân theo tháng từ data
            $patients = \DB::table('synced_patients')
                ->selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, count(*) as total')
                ->groupBy('month')
                ->orderBy('month', 'asc')
                ->get()
                ->pluck('total', 'month');

            // Nếu trống lập 1 data rỗng để biểu đồ không bị lỗi
            if ($patients->isEmpty()) {
                $patients = [ date('Y-m') => 0 ];
            }

            return response()->json([
                'success' => true,
                'data' => $patients
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * API Hiệu suất Bác sĩ
     */
    public function doctors(Request $request)
    {
        try {
            // Lấy thẳng danh sách bác sĩ từ data
            $doctors = \DB::table('synced_doctors')->get()->map(function($doc) {
                return [
                    'name' => $doc->name,
                    'cases' => $doc->cases_count
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $doctors
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Get monthly report.
     */
    public function monthly(string $month): JsonResponse
    {
        try {
            $data = $this->reportService->getMonthlyReport($month);
            return response()->json([
                'success' => true,
                'data' => $data,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load monthly report',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get yearly report.
     */
    public function yearly(string $year): JsonResponse
    {
        try {
            $data = $this->reportService->getYearlyReport($year);
            return response()->json([
                'success' => true,
                'data' => $data,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load yearly report',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Generate a new report.
     */
    public function generate(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'name' => 'required|string',
                'type' => 'required|in:treatment_success,revenue,patient,doctor,monthly,yearly',
                'parameters' => 'nullable|array',
            ]);

            $report = $this->reportService->generateReport(
                $request->name,
                $request->type,
                $request->parameters ?? [],
                auth()->id()
            );

            return response()->json([
                'success' => true,
                'message' => 'Report generation started',
                'data' => $report,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate report',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Download a report.
     */
    public function download(int $id): JsonResponse
    {
        try {
            $report = \App\Models\Report::findOrFail($id);

            if (!$report->isReady()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Report is not ready for download',
                ], 400);
            }

            if (!Storage::exists($report->file_path)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Report file not found',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'download_url' => Storage::url($report->file_path),
                    'file_name' => basename($report->file_path),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to download report',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
