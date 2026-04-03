<?php

namespace App\Services;

use App\DTOs\Requests\CreateStorageRecordRequestDTO;
use App\DTOs\Responses\StorageRecordResponseDTO;
use App\Repositories\Contracts\StorageRecordRepositoryInterface;
use Illuminate\Support\Facades\DB;

class StorageRecordService extends BaseService
{
    public function __construct(StorageRecordRepositoryInterface $storageRepository)
    {
        parent::__construct($storageRepository);
    }

    public function createStorage(CreateStorageRecordRequestDTO $dto): StorageRecordResponseDTO
    {
        DB::beginTransaction();
        try {
            $storage = $this->repository->create([
                'patient_id' => $dto->patient_id,
                'sample_type' => $dto->sample_type,
                'tank_location' => $dto->tank_location,
                'freeze_date' => $dto->freeze_date,
                'expiration_date' => $dto->expiration_date,
            ]);
            DB::commit();
            return StorageRecordResponseDTO::fromModel($storage);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}