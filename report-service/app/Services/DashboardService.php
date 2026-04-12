<?php

namespace App\Services;

use App\Models\Dashboard;
use App\Models\ReportCache;
use App\Models\TreatmentStat;
use App\Models\RevenueStat;
use Illuminate\Support\Facades\Cache;

class DashboardService
{
    protected $cacheService;
    protected $statisticsService;

    public function __construct(CacheService $cacheService, StatisticsService $statisticsService)
    {
        $this->cacheService = $cacheService;
        $this->statisticsService = $statisticsService;
    }

    /**
     * Get dashboard data.
     */
    public function getDashboardData(): array
    {
        $cacheKey = 'dashboard_data';

        return $this->cacheService->remember($cacheKey, function () {
            $dashboard = Dashboard::getDefault();
            $currentMonth = now()->format('Y-m');

            return [
                'dashboard' => $dashboard,
                'overview' => $this->getSystemOverview(),
                'treatment_stats' => $this->statisticsService->getTreatmentSuccessStats($currentMonth),
                'revenue_stats' => $this->statisticsService->getRevenueStats($currentMonth),
                'recent_reports' => \App\Models\Report::withStatus('ready')
                    ->orderBy('created_at', 'desc')
                    ->limit(5)
                    ->get(),
            ];
        }, config('services.dashboard_cache_ttl', 900));
    }

    /**
     * Get system overview.
     */
    public function getSystemOverview(): array
    {
        $cacheKey = 'system_overview';

        return $this->cacheService->remember($cacheKey, function () {
            $currentMonth = now()->format('Y-m');

            return [
                'total_patients' => $this->getTotalPatients(),
                'total_doctors' => $this->getTotalDoctors(),
                'active_treatments' => $this->getActiveTreatments(),
                'completed_treatments' => $this->getCompletedTreatments(),
                'total_revenue' => RevenueStat::getTotalRevenueForPeriod($currentMonth),
                'success_rate' => TreatmentStat::getAverageSuccessRate($currentMonth),
                'period' => $currentMonth,
            ];
        }, config('services.dashboard_cache_ttl', 900));
    }

    /**
     * Get total patients count.
     */
    protected function getTotalPatients(): int
    {
        // This would typically call the user-service API
        // For now, return a placeholder
        return 0;
    }

    /**
     * Get total doctors count.
     */
    protected function getTotalDoctors(): int
    {
        // This would typically call the catalog-service API
        // For now, return a placeholder
        return 0;
    }

    /**
     * Get active treatments count.
     */
    protected function getActiveTreatments(): int
    {
        return TreatmentStat::where('period', now()->format('Y-m'))
            ->sum('in_progress');
    }

    /**
     * Get completed treatments count.
     */
    protected function getCompletedTreatments(): int
    {
        return TreatmentStat::where('period', now()->format('Y-m'))
            ->sum('completed');
    }
}
