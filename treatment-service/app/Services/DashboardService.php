<?php

namespace App\Services;

use App\Models\TreatmentProtocol;
use App\Models\MedicationSchedule;
use App\Models\PregnancyTracking;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class DashboardService
{
    /**
     * Lấy dữ liệu đếm số lượng cho Dashboard
     */
    public function getDashboardData(?int $doctorId): array
    {
        try {
            $today = Carbon::today();

            // 1. Đếm số ca đang điều trị
            $activeTreatments = TreatmentProtocol::where('is_active', true)
                ->when($doctorId, fn($q) => $q->where('doctor_id', $doctorId))
                ->count();

            // 2. Đếm số lịch thuốc/tiêm trong ngày hôm nay
            $todaySchedules = MedicationSchedule::whereDate('start_date', '<=', $today)
                ->whereDate('end_date', '>=', $today)
                ->count();

            // 3. Đếm số ca đậu thai mới (Trạng thái ongoing)
            $successfulPregnancies = PregnancyTracking::whereIn('status', ['ongoing', 'delivered'])
                                          ->where('is_active', true)
                                          ->count();

            // Trả về MẢNG  để Frontend đọc được  (stats?.active_treatments)
            return [
                'active_treatments' => $activeTreatments,
                'today_schedules' => $todaySchedules,
                'successful_pregnancies' => $successfulPregnancies,
            ];

        } catch (\Throwable $e) {
            // Bắt lỗi
            Log::error("Lỗi getDashboardData: " . $e->getMessage());

            return [
                'active_treatments' => 0,
                'today_schedules' => 0,
                'successful_pregnancies' => 0,
                'error' => 'Lỗi truy vấn dữ liệu: ' . $e->getMessage()
            ];
        }
    }
}
