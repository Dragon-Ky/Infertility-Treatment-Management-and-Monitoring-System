<?php

namespace App\Services;

use App\DTOs\Responses\MedicationScheduleResponseDTO;
use App\Repositories\Contracts\MedicationScheduleRepositoryInterface;

class MedicationScheduleService extends BaseService
{
    protected function getCacheKeyPrefix(): string { return 'medication_schedule'; }
    public function getResponseDtoClass(): string { return MedicationScheduleResponseDTO::class; }

    public function __construct(MedicationScheduleRepositoryInterface $repository)
    {
        parent::__construct($repository);
    }
}