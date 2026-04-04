<?php

namespace App\Services;

use App\DTOs\Requests\CreateMedicationRecordRequestDTO;
use App\DTOs\Responses\MedicationRecordResponseDTO;
use App\Repositories\Contracts\MedicationRecordRepositoryInterface;
use Illuminate\Support\Facades\DB;

class MedicationRecordService
{
    public function __construct(protected MedicationRecordRepositoryInterface $repository) {}

    public function createRecord(CreateMedicationRecordRequestDTO $dto): MedicationRecordResponseDTO
    {
        DB::beginTransaction();
        try {
            $record = $this->repository->create([
                'medication_schedule_id' => $dto->medication_schedule_id,
                'scheduled_time'         => $dto->scheduled_time,
                'actual_time'            => $dto->actual_time,
                'status'                 => $dto->status,
                'recorded_by'            => $dto->recorded_by,
                'notes'                  => $dto->notes,
            ]);
            DB::commit();
            return MedicationRecordResponseDTO::fromModel($record);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}