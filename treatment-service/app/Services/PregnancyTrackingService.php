<?php

namespace App\Services;

use App\DTOs\Requests\CreatePregnancyTrackingRequestDTO;
use App\DTOs\Responses\PregnancyTrackingResponseDTO;
use App\Repositories\Contracts\PregnancyTrackingRepositoryInterface;
use Illuminate\Support\Facades\DB;

class PregnancyTrackingService extends BaseService
{
    public function __construct(PregnancyTrackingRepositoryInterface $trackingRepository)
    {
        parent::__construct($trackingRepository);
    }

    public function createTracking(CreatePregnancyTrackingRequestDTO $dto): PregnancyTrackingResponseDTO
    {
        DB::beginTransaction();
        try {
            $tracking = $this->repository->create([
                'protocol_id' => $dto->protocol_id,
                'beta_hcg_level' => $dto->beta_hcg_level,
                'gestational_age_weeks' => $dto->gestational_age_weeks,
                'fetal_heartbeat' => $dto->fetal_heartbeat,
                'outcome' => $dto->outcome,
            ]);
            DB::commit();
            return PregnancyTrackingResponseDTO::fromModel($tracking);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}