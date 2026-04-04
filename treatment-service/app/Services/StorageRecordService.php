<?php

namespace App\Services;

use App\DTOs\Requests\CreateStorageRecordRequestDTO;
use App\DTOs\Responses\StorageRecordResponseDTO;
use App\Repositories\Contracts\StorageRecordRepositoryInterface;
use Illuminate\Support\Facades\DB;

class StorageRecordService
{
    public function __construct(protected StorageRecordRepositoryInterface $repository) {}

    public function createStorage(CreateStorageRecordRequestDTO $dto): StorageRecordResponseDTO
    {
        return DB::transaction(function () use ($dto) {
            $storage = $this->repository->create([
                'treatment_id'  => $dto->treatment_id,
                'storage_type'  => $dto->storage_type,
                'item_id'       => $dto->item_id,
                'start_date'    => $dto->start_date,
                'expiry_date'   => $dto->expiry_date,
                'status'        => 'active',
                'location_code' => $dto->location_code,
            ]);
            
            return StorageRecordResponseDTO::fromModel($storage);
        });
    }
}