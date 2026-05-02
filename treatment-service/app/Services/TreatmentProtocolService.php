<?php

namespace App\Services;

use App\DTOs\Responses\TreatmentProtocolResponseDTO;
use App\Repositories\Contracts\TreatmentProtocolRepositoryInterface;

use Illuminate\Support\Facades\DB;

class TreatmentProtocolService extends BaseService
{
    protected function getCacheKeyPrefix(): string { return 'treatment_protocol'; }
    public function getResponseDtoClass(): string { return TreatmentProtocolResponseDTO::class; }

    public function __construct(TreatmentProtocolRepositoryInterface $repository)
    {
        parent::__construct($repository);
    }

    /**
     * Override createFromDto để tự động sinh mã phác đồ
     */
    public function createFromDto(object $dto)
    {
        return DB::transaction(function () use ($dto) {
            $data = (array) $dto;

            // Tự động sinh mã phác đồ (Ví dụ: PHD-20240425-ABCD)
            $data['protocol_code'] = 'PHD-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -4));

            if (!isset($data['is_active'])) {
                $data['is_active'] = true;
            }

            $model = $this->repository->create($data);

            $this->clearCache($model->id);

            $dtoClass = $this->getResponseDtoClass();
            return $dtoClass::fromModel($model);
        });
    }

    public function updateFromDto(int $id, object $dto)
    {
        return DB::transaction(function () use ($id, $dto) {
            $data = array_filter((array) $dto, fn($value) => $value !== null);

            $model = $this->repository->update($id, $data);

            $this->clearCache($model->id);
            $this->notifyReportServiceToClearCache(); // GỌI XÓA CACHE BÊN REPORT

            $dtoClass = $this->getResponseDtoClass();
            return $dtoClass::fromModel($model);
        });
    }

    /**
     * HÀM NÀY SẼ ĐÁNH ĐIỆN TÍN QUA REPORT SERVICE ĐỂ XÓA CACHE
     */
    protected function notifyReportServiceToClearCache(): void
    {
        try {
            // Ní nhớ cấu hình REPORT_SERVICE_URL=http://127.0.0.1:8006 trong file .env của Treatment nha!
            $url = env('REPORT_SERVICE_URL', 'http://127.0.0.1:8006') . '/api/clear-dashboard-cache';

            // Gọi âm thầm qua Report Service không làm ảnh hưởng tốc độ của Bác sĩ
            Http::timeout(3)->post($url);

            Log::info("Đã gửi yêu cầu xóa cache sang Report Service thành công.");
        } catch (\Exception $e) {
            Log::warning("Không thể gọi Report Service để xóa cache: " . $e->getMessage());
        }
    }
}
