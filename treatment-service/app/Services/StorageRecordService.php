<?php

namespace App\Services;

use App\DTOs\Responses\StorageRecordResponseDTO;
use App\Repositories\Contracts\StorageRecordRepositoryInterface;

class StorageRecordService extends BaseService
{
    protected function getCacheKeyPrefix(): string { return 'storage_record'; }
    public function getResponseDtoClass(): string { return StorageRecordResponseDTO::class; }

    public function __construct(StorageRecordRepositoryInterface $repository)
    {
        parent::__construct($repository);
    }
}