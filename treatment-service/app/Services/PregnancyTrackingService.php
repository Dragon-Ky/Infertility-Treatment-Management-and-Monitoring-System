<?php

namespace App\Services;

use App\DTOs\Requests\CreatePregnancyTrackingRequestDTO;
use App\DTOs\Responses\PregnancyTrackingResponseDTO;
use App\DTOs\Requests\update\UpdatePregnancyTrackingRequestDTO;
use App\Repositories\Contracts\PregnancyTrackingRepositoryInterface;
use Illuminate\Support\Facades\DB;

class PregnancyTrackingService extends BaseService
{
    public function __construct(PregnancyTrackingRepositoryInterface $repository) 
    {
        parent::__construct($repository);
    }

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
        return $this->updateWithDto($id, $dto);
    }
    public function deleteTracking(int $id): bool
    {
        // Thay vì xóa vĩnh viễn, ta cập nhật trạng thái thành false
        return $this->delete($id);
    }
    public function getTrackingById(int $id): PregnancyTrackingResponseDTO
    {
        $tracking = $this->repository->find($id);
        return PregnancyTrackingResponseDTO::fromModel($tracking);
    }
    public function getResponseDtoClass(): string
    {
        return PregnancyTrackingResponseDTO::class;
    }
}