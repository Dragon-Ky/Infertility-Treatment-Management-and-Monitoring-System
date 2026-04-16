<?php

namespace App\Services;

use App\DTOs\Responses\TreatmentProtocolResponseDTO;
use App\Repositories\Contracts\TreatmentProtocolRepositoryInterface;

class TreatmentProtocolService extends BaseService
{
    protected function getCacheKeyPrefix(): string { return 'treatment_protocol'; }
    public function getResponseDtoClass(): string { return TreatmentProtocolResponseDTO::class; }

    public function __construct(TreatmentProtocolRepositoryInterface $repository)
    {
        parent::__construct($repository);
    }
}