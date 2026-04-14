<?php

namespace App\Services;

use App\DTOs\Responses\SpecimenRecordResponseDTO;
use App\Repositories\Contracts\SpecimenRecordRepositoryInterface;

class SpecimenRecordService extends BaseService
{
    protected function getCacheKeyPrefix(): string { return 'specimen_record'; }
    public function getResponseDtoClass(): string { return SpecimenRecordResponseDTO::class; }

    public function __construct(SpecimenRecordRepositoryInterface $repository)
    {
        parent::__construct($repository);
    }
}