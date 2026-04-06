<?php

namespace App\Services;

use App\DTOs\Requests\CreatePregnancyTrackingRequestDTO;
use App\DTOs\Responses\PregnancyTrackingResponseDTO;
use App\DTOs\Requests\update\UpdatePregnancyTrackingRequestDTO;
use App\Repositories\Contracts\PregnancyTrackingRepositoryInterface;
use Illuminate\Support\Facades\DB;

class PregnancyTrackingService
{
    public function __construct(protected PregnancyTrackingRepositoryInterface $repository) {}

    public function createTracking(CreatePregnancyTrackingRequestDTO $dto): PregnancyTrackingResponseDTO
    {
        return DB::transaction(function () use ($dto) {
            $tracking = $this->repository->create([
                'treatment_id'  => $dto->treatment_id,
                'tracking_date' => $dto->tracking_date,
                'week_number'   => $dto->week_number,
                'status'        => $dto->status,
                'notes'         => $dto->notes,
            ]);
            return PregnancyTrackingResponseDTO::fromModel($tracking);
        });
    }
    public function updateTracking(int $id, UpdatePregnancyTrackingRequestDTO $dto): PregnancyTrackingResponseDTO
    {
        return DB::transaction(function () use ($id, $dto) {
            $data = array_filter((array) $dto, fn($value) => !is_null($value));
            $tracking = $this->repository->update($id, $data);
            return PregnancyTrackingResponseDTO::fromModel($tracking);
        });
    }
    public function deleteTracking(int $id): bool
    {
        // Thay vì xóa vĩnh viễn, ta cập nhật trạng thái thành false
        return $this->deleteTracking($id);
    }
    public function getTrackingById(int $id): PregnancyTrackingResponseDTO
    {
        $tracking = $this->repository->find($id);
        return PregnancyTrackingResponseDTO::fromModel($tracking);
    }
}