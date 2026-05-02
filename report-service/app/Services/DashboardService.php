<?php

namespace App\Services;

use App\Models\Dashboard;
use App\Models\TreatmentStat;
use App\Models\RevenueStat;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class DashboardService
{
    protected $cacheService;
    protected $statisticsService;

    public function __construct(CacheService $cacheService, StatisticsService $statisticsService)
    {
        $this->cacheService = $cacheService;
        $this->statisticsService = $statisticsService;
    }

    public function getDashboardData(): array
    {
        $cacheKey = 'dashboard_data';

        return $this->cacheService->remember($cacheKey, function () {
            $dashboard = Dashboard::first() ?? new Dashboard();
            $currentMonth = now()->format('Y-m');

            return [
                'dashboard' => $dashboard,
                'overview' => $this->getSystemOverview(),
                'treatment_stats' => $this->statisticsService->getTreatmentSuccessStats($currentMonth),
                'revenue_stats' => $this->statisticsService->getRevenueStats($currentMonth),
                'recent_reports' => \App\Models\Report::where('status', 'ready')
                    ->orderBy('created_at', 'desc')
                    ->limit(5)
                    ->get(),
            ];
        }, 15); 
    }

   public function getSystemOverview(): array
    {
        $cacheKey = 'system_overview';

        return $this->cacheService->remember($cacheKey, function () {
            $currentMonth = now()->format('Y-m');

            // 1. Lấy dữ liệu tổng hợp từ Dashboard Summary
            $treatmentSummary = $this->getTreatmentSummaryFromService();

            // 2. Gọi thêm hàm đếm TỔNG SỐ PHÁC ĐỒ
            $totalTreatments = $this->getTotalProtocols();

            $treatmentStats = $this->statisticsService->getTreatmentSuccessStats($currentMonth);
            $revenueStats = $this->statisticsService->getRevenueStats($currentMonth);

            return [
                'total_patients' => $this->getTotalPatients(),
                'total_doctors' => $this->getTotalDoctors(),

                // Móc dữ liệu từ Treatment
                'total_treatments' => $totalTreatments, // Tổng tất cả các ca
                'active_treatments' => $treatmentSummary['active_treatments'] ?? 0,
                'completed_treatments' => $treatmentSummary['successful_pregnancies'] ?? 0,

                'total_revenue' => $revenueStats['total_revenue'] ?? 0,
                'success_rate' => $treatmentStats['success_rate'] ?? 0,
                'period' => $currentMonth,
            ];
        }, 15);
    }

    /**
     *ĐẾM TỔNG CA ĐIỀU TRỊ (TỪ PROTOCOLS)
     */
    protected function getTotalProtocols(): int
    {
        try {
            $token = request()->bearerToken();
            $url = env('TREATMENT_SERVICE_URL', 'http://127.0.0.1:8001') . '/api/v1/treatment/protocols?all=true';

            $response = Http::withToken($token)->acceptJson()->timeout(5)->get($url);
            $data = $response->json();

            if ($response->successful()) {
                if (isset($data['data']) && is_array($data['data'])) {
                    return count($data['data']);
                } elseif (is_array($data)) {
                    return count($data);
                }
            }
            return 0;
        } catch (\Exception $e) {
            Log::error('Lỗi lấy tổng ca điều trị: ' . $e->getMessage());
            return 0;
        }
    }

    /*
     * GỌI QUA AUTH SERVICE ĐỂ ĐẾM SỐ KHÁCH HÀNG
     */
    protected function getTotalPatients(): int
    {
        try {
            $token = request()->bearerToken();
            $url = env('AUTH_SERVICE_URL', 'http://127.0.0.1:8000') . '/api/doctor/customers';

            $response = Http::withToken($token)->acceptJson()->timeout(5)->get($url);
            $data = $response->json();

            if ($response->successful() && isset($data['count'])) {
                return (int) $data['count'];
            }

            Log::warning('Lỗi lấy Patient. Response từ Auth: ', $data ?? ['status' => $response->status()]);
            return 0;
        } catch (\Exception $e) {
            Log::error('Lỗi mạng khi lấy số Khách hàng: ' . $e->getMessage());
            return 0;
        }
    }

    /**
     * GỌI QUA AUTH SERVICE LẤY SỐ BÁC SĨ
     */
   protected function getTotalDoctors(): int
    {
        try {
            $token = request()->bearerToken();
            $url = env('AUTH_SERVICE_URL', 'http://127.0.0.1:8000') . '/api/doctors';

            $response = Http::withToken($token)->acceptJson()->timeout(5)->get($url);
            $data = $response->json();

            if ($response->successful()) {
                // CHỖ NÀY NÈ: Có count thì xài count, không có thì đếm mảng data!
                if (isset($data['count'])) {
                    return (int) $data['count'];
                } elseif (isset($data['data']) && is_array($data['data'])) {
                    return count($data['data']);
                }
            }

            Log::warning('Lỗi lấy Doctor. Response từ Auth: ', $data ?? ['status' => $response->status()]);
            return 0;
        } catch (\Exception $e) {
            Log::error('Lỗi mạng khi lấy số Bác sĩ: ' . $e->getMessage());
            return 0;
        }
    }


    /*
     * GỌI QUA TREATMENT SERVICE ĐỂ LẤY THỐNG KÊ ĐIỀU TRỊ
    */
    protected function getTreatmentSummaryFromService(): array
    {
        try {
            $token = request()->bearerToken();

            $url = env('TREATMENT_SERVICE_URL', 'http://127.0.0.1:8001') . '/api/v1/treatment/dashboard/summary?all=true';

            $response = Http::withToken($token)->acceptJson()->timeout(5)->get($url);
            $data = $response->json();

            if ($response->successful()) {
                if (isset($data['data']) && is_array($data['data'])) {
                    return $data['data'];
                } elseif (is_array($data)) {
                    return $data;
                }
            }

            Log::warning('Lỗi lấy Treatment Summary. Response: ', $data ?? ['status' => $response->status()]);
            return [];
        } catch (\Exception $e) {
            Log::error('Lỗi mạng khi lấy Treatment Summary: ' . $e->getMessage());
            return [];
        }
    }
}
