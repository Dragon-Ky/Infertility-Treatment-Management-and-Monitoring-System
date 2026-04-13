<?php

namespace App\Services;

use App\DTOs\Requests\CreateStorageRecordRequestDTO;
use App\DTOs\Responses\StorageRecordResponseDTO;
use App\DTOs\Requests\update\UpdateStorageRecordRequestDTO;
use App\Repositories\Contracts\StorageRecordRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class StorageRecordService extends BaseService
{
    protected function getCacheKeyPrefix(): string
    {
        return 'storage_record';
    }
    protected function getResponseDtoClass(): string
    {
        return StorageRecordResponseDTO::class;
    }
    public function __construct(StorageRecordRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

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
                'is_active'     => true,
            ]);
            Cache::forget("storage_record:all_active");

            return StorageRecordResponseDTO::fromModel($storage);
        });
    }
    public function updateStorage(int $id, UpdateStorageRecordRequestDTO $dto): StorageRecordResponseDTO
    {
        return $this->updateWithDto($id, $dto);
    }
    public function deleteStorageRecord(int $id): bool
    {
        // Thay vì xóa vĩnh viễn, ta cập nhật trạng thái thành false
        return $this->delete($id);
    }
    public function getStorageRecordById(int $id): StorageRecordResponseDTO
    {
        $storage = $this->repository->find($id);
        return StorageRecordResponseDTO::fromModel($storage);
    }
}