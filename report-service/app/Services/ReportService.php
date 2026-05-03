<?php

namespace App\Services;

use App\Models\Report;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;

class ReportService
{
    protected $statisticsService;
    protected $cacheService;

    public function __construct(StatisticsService $statisticsService, CacheService $cacheService)
    {
        $this->statisticsService = $statisticsService;
        $this->cacheService = $cacheService;
    }

    /**
     * Generate a new report.
     */
    public function generateReport(string $name, string $type, array $parameters, ?int $generatedBy): Report
    {
        $report = Report::create([
            'name' => $name,
            'type' => $type,
            'parameters' => $parameters,
            'generated_by' => $generatedBy,
            'status' => 'generating',
        ]);

        // In a real implementation, this would be queued
        $this->processReport($report);

        return $report;
    }

    /*
     * Process report generation.
     */
    protected function processReport(Report $report): void
    {
        try {
            $data = $this->gatherReportData($report->type, $report->parameters ?? []);

            // Đổi đuôi file thành .pdf
            $fileName = 'reports/' . $report->id . '_' . time() . '.pdf';

            // Gọi thư viện PDF, nhúng data vào file giao diện
            $pdf = Pdf::loadView('reports.pdf-template', [
                'report' => $report,
                'data' => $data
            ]);

            // Set khổ giấy A4
            $pdf->setPaper('a4', 'portrait');

            // Lưu file PDF vào storage
            Storage::put($fileName, $pdf->output());

            $report->update([
                'status' => 'ready',
                'file_path' => $fileName,
            ]);
        } catch (\Exception $e) {
            $report->update(['status' => 'failed']);
            throw $e;
        }
    }

    /**
     * Gather data for report based on type.
     */
    protected function gatherReportData(string $type, array $parameters): array
    {
        $period = $parameters['period'] ?? now()->format('Y-m');

        return match ($type) {
            'treatment_success' => $this->statisticsService->getTreatmentSuccessStats($period),
            'revenue' => $this->statisticsService->getRevenueStats($period),
            'patient' => $this->statisticsService->getPatientStats($period),
            'doctor' => $this->statisticsService->getDoctorPerformance($period),
            'monthly' => $this->getMonthlyReport($period),
            'yearly' => $this->getYearlyReport($period),
            default => throw new \InvalidArgumentException("Unknown report type: {$type}"),
        };
    }

    /*
     * Get monthly report.
     */
    public function getMonthlyReport(string $month): array
    {
        $cacheKey = "monthly_report_{$month}";

        return $this->cacheService->remember($cacheKey, function () use ($month) {

            //  Lấy dữ liệu Phác đồ thật
            $treatmentStats = \Illuminate\Support\Facades\DB::table('synced_protocols')
                ->selectRaw('status as name, count(*) as total')
                ->whereRaw("DATE_FORMAT(created_at, '%Y-%m') = ?", [$month])
                ->groupBy('status')
                ->get()
                ->pluck('total', 'name')
                ->toArray();

            if (empty($treatmentStats)) {
                $treatmentStats = ['Chưa có dữ liệu' => 0];
            }

            // Lấy dữ liệu Doanh thu thật
            $totalRevenue = \Illuminate\Support\Facades\DB::table('synced_protocols')
                ->where('status', 'completed')
                ->whereRaw("DATE_FORMAT(created_at, '%Y-%m') = ?", [$month])
                ->sum('price');

            $revenueStats = [
                'Doanh thu IVF' => $totalRevenue * 0.8,
                'Dịch vụ IUI' => $totalRevenue * 0.1,
                'Khám & Xét nghiệm' => $totalRevenue * 0.1,
            ];

            return [
                'period' => $month,
                'type' => 'monthly',
                'treatment_stats' => $treatmentStats,
                'revenue_stats' => $revenueStats,
                'generated_at' => now()->toIso8601String(),
            ];
        }, config('services.report_cache_ttl', 3600));
    }

    /**
     * Get yearly report.
     */
    public function getYearlyReport(string $year): array
    {
        $cacheKey = "yearly_report_{$year}";

        return $this->cacheService->remember($cacheKey, function () use ($year) {
            $monthlyData = [];
            for ($month = 1; $month <= 12; $month++) {
                $period = sprintf('%s-%02d', $year, $month);
                $monthlyData[$period] = $this->statisticsService->getTreatmentSuccessStats($period);
            }

            return [
                'period' => $year,
                'type' => 'yearly',
                'monthly_breakdown' => $monthlyData,
                'summary' => $this->calculateYearlySummary($monthlyData),
                'generated_at' => now()->toIso8601String(),
            ];
        }, config('services.report_cache_ttl', 3600));
    }

    /**
     * Calculate yearly summary from monthly data.
     */
    protected function calculateYearlySummary(array $monthlyData): array
    {
        $totalCases = 0;
        $totalCompleted = 0;
        $totalInProgress = 0;
        $totalCancelled = 0;

        foreach ($monthlyData as $data) {
            $totalCases += $data['total_cases'] ?? 0;
            $totalCompleted += $data['completed'] ?? 0;
            $totalInProgress += $data['in_progress'] ?? 0;
            $totalCancelled += $data['cancelled'] ?? 0;
        }

        return [
            'total_cases' => $totalCases,
            'completed' => $totalCompleted,
            'in_progress' => $totalInProgress,
            'cancelled' => $totalCancelled,
            'success_rate' => $totalCases > 0 ? round(($totalCompleted / $totalCases) * 100, 2) : 0,
        ];
    }

    /*
     * Download a report.
     */
    public function download(int $id)
    {
        try {
            $report = \App\Models\Report::findOrFail($id);

            // Nếu đường dẫn file bị NULL (data cũ) -> Báo lỗi luôn, khỏi tìm file
            if (empty($report->file_path)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Lỗi: Báo cáo này là dữ liệu cũ, không có file đính kèm.',
                ], 404);
            }

            if (!$report->isReady()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Báo cáo chưa sẵn sàng để tải xuống',
                ], 400);
            }

            if (!Storage::exists($report->file_path)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy file PDF trên hệ thống',
                ], 404);
            }

            // ÉP TRÌNH DUYỆT TẢI FILE PDF VỀ MÁY
            return Storage::download($report->file_path, 'Medicen_Report_' . $report->id . '.pdf');

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to download report',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
