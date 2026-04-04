<?php

namespace App\Services;

use App\DTOs\Requests\CreatePregnancyTrackingRequestDTO;
use App\DTOs\Responses\PregnancyTrackingResponseDTO;
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
}