<?php

namespace App\Services;

use App\DTOs\Responses\LabResultResponseDTO;
use App\Repositories\Contracts\LabResultRepositoryInterface;

class LabResultService extends BaseService
{
    protected function getCacheKeyPrefix(): string { return 'lab_result'; }
    public function getResponseDtoClass(): string { return LabResultResponseDTO::class; }

    public function __construct(LabResultRepositoryInterface $repository)
    {
        parent::__construct($repository);
    }
}