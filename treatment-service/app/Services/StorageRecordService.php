<?php

namespace App\Services;

use App\DTOs\Requests\CreateStorageRecordRequestDTO;
use App\DTOs\Responses\StorageRecordResponseDTO;
use App\DTOs\Requests\update\UpdateStorageRecordRequestDTO;
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
    public function updateStorage(int $id, UpdateStorageRecordRequestDTO $dto): StorageRecordResponseDTO
    {
        return DB::transaction(function () use ($id, $dto) {
            $data = array_filter((array) $dto, fn($value) => !is_null($value));
            $storage = $this->repository->update($id, $data);
            return StorageRecordResponseDTO::fromModel($storage);
        });
    }
    public function deleteStorageRecord(int $id): bool
    {
        // Thay vì xóa vĩnh viễn, ta cập nhật trạng thái thành false
        return $this->deleteStorageRecord($id);
    }

}