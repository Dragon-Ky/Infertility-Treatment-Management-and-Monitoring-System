<?php

namespace App\Services;

use App\Models\Report;
use Illuminate\Support\Facades\Storage;

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

    /**
     * Process report generation.
     */
    protected function processReport(Report $report): void
    {
        try {
            $data = $this->gatherReportData($report->type, $report->parameters ?? []);

            $fileName = 'reports/' . $report->id . '_' . time() . '.json';
            Storage::put($fileName, json_encode($data, JSON_PRETTY_PRINT));

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

    /**
     * Get monthly report.
     */
    public function getMonthlyReport(string $month): array
    {
        $cacheKey = "monthly_report_{$month}";

        return $this->cacheService->remember($cacheKey, function () use ($month) {
            return [
                'period' => $month,
                'type' => 'monthly',
                'treatment_stats' => $this->statisticsService->getTreatmentSuccessStats($month),
                'revenue_stats' => $this->statisticsService->getRevenueStats($month),
                'patient_stats' => $this->statisticsService->getPatientStats($month),
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
}
