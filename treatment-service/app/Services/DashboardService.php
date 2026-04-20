<?php

namespace App\Services;

use App\Models\TreatmentProtocol;
use App\Models\LabResult;
use App\Models\PregnancyTracking;
use App\Models\SpecimenRecord;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\DTOs\Responses\DashboardResponseDTO;

class DashboardService
{
    /**
     * Lấy toàn bộ dữ liệu Dashboard aggregated
     * 
     * @param int|null $doctorId
     * @return array
     */
    public function getDashboardData(?int $doctorId): array
    {
        $summary = $this->getSummaryStats($doctorId);
        $charts = $this->getChartData($doctorId);
        $upcoming = $this->getUpcomingQueue($doctorId);

        return DashboardResponseDTO::fromData($summary, $charts, $upcoming)->toArray();
    }

    /**
     * Thống kê các con số tổng quát (Summary Cards)
     */
    private function getSummaryStats(?int $doctorId): array
    {
        $today = Carbon::today();
        $startOfWeek = Carbon::now()->startOfWeek();

        return [
            'today_patients' => TreatmentProtocol::whereDate('created_at', $today)
                ->when($doctorId, fn($q) => $q->where('doctor_id', $doctorId))
                ->count(),
            'pending_labs' => LabResult::where('is_active', true)
                ->whereNull('doctor_notes')
                ->count(),
            'active_pregnancies' => PregnancyTracking::where('is_active', true)->count(),
            'total_specimens' => SpecimenRecord::where('is_active', true)->count(),
            'weekly_new_cases' => TreatmentProtocol::where('created_at', '>=', $startOfWeek)
                ->when($doctorId, fn($q) => $q->where('doctor_id', $doctorId))
                ->count(),
        ];
    }

    /**
     * Lấy dữ liệu biểu đồ (Thống kê 7 ngày gần nhất)
     */
    private function getChartData(?int $doctorId): array
    {
        return TreatmentProtocol::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('count(*) as count')
            )
            ->where('created_at', '>=', Carbon::now()->subDays(7))
            ->when($doctorId, fn($q) => $q->where('doctor_id', $doctorId))
            ->groupBy('date')
            ->orderBy('date', 'ASC')
            ->get()
            ->toArray();
    }

    /**
     * Danh sách bệnh nhân tiếp theo (Queue trong ngày)
     */
    private function getUpcomingQueue(?int $doctorId): array
    {
        $today = Carbon::today();
        
        return TreatmentProtocol::select('id', 'treatment_id', 'protocol_name', 'created_at')
            ->whereDate('created_at', $today)
            ->when($doctorId, fn($q) => $q->where('doctor_id', $doctorId))
            ->orderBy('created_at', 'DESC')
            ->limit(5)
            ->get()
            ->toArray();
    }
}
