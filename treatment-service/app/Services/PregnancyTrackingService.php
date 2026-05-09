<?php

namespace App\Services;

use App\DTOs\Responses\PregnancyTrackingResponseDTO;
use App\Repositories\Contracts\PregnancyTrackingRepositoryInterface;

class PregnancyTrackingService extends BaseService
{
    protected function getCacheKeyPrefix(): string { return 'pregnancy_tracking'; }
    public function getResponseDtoClass(): string { return PregnancyTrackingResponseDTO::class; }

    public function __construct(PregnancyTrackingRepositoryInterface $repository)
    {
        parent::__construct($repository);
    }
}