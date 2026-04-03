<?php

namespace App\Services;

use App\DTOs\Requests\CreateMedicationRecordRequestDTO;
use App\DTOs\Responses\MedicationRecordResponseDTO;
use App\Repositories\Contracts\MedicationRecordRepositoryInterface;
use Illuminate\Support\Facades\DB;

class MedicationRecordService extends BaseService
{
    public function __construct(MedicationRecordRepositoryInterface $recordRepository)
    {
        parent::__construct($recordRepository);
    }

    public function createRecord(CreateMedicationRecordRequestDTO $dto): MedicationRecordResponseDTO
    {
        DB::beginTransaction();
        try {
            $record = $this->repository->create([
                'schedule_id' => $dto->schedule_id,
                'administered_at' => $dto->administered_at,
                'staff_id' => $dto->staff_id,
                'notes' => $dto->notes,
            ]);
            DB::commit();
            return MedicationRecordResponseDTO::fromModel($record);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}