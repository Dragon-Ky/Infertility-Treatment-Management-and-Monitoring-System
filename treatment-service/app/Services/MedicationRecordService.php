<?php

namespace App\Services;

use App\DTOs\Requests\CreateMedicationRecordRequestDTO;
use App\DTOs\Responses\MedicationRecordResponseDTO;
use App\DTOs\Requests\update\UpdateMedicationRecordRequestDTO;
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
    public function updateRecord(int $id, UpdateMedicationRecordRequestDTO $dto): MedicationRecordResponseDTO
    {
        return DB::transaction(function () use ($id, $dto) {
            $data = array_filter((array) $dto, fn($value) => !is_null($value));
            $record = $this->repository->update($id, $data);
            return MedicationRecordResponseDTO::fromModel($record);
        });
    }
    public function deleteRecord(int $id): bool
    {
        // Thay vì xóa vĩnh viễn, ta cập nhật trạng thái thành false
        return $this->deleteRecord($id);
    }
    public function getRecordById(int $id): MedicationRecordResponseDTO
    {
        $record = $this->repository->find($id);
        return MedicationRecordResponseDTO::fromModel($record);
    }
    public function getResponseDtoClass(): string
    {
        return MedicationRecordResponseDTO::class;
    }
}