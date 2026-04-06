<?php

namespace App\Services;

use App\DTOs\Requests\CreateMedicationRecordRequestDTO;
use App\DTOs\Responses\MedicationRecordResponseDTO;
use App\DTOs\Requests\update\UpdateMedicationRecordRequestDTO;
use App\Repositories\Contracts\MedicationRecordRepositoryInterface;
use Illuminate\Support\Facades\DB;

class MedicationRecordService extends BaseService
{
    public function __construct( MedicationRecordRepositoryInterface $repository) 
    {
        parent::__construct($repository);
    }
    public function createRecord(CreateMedicationRecordRequestDTO $dto): MedicationRecordResponseDTO
    {
        return DB::transaction(function () use ($dto) {
            $record = $this->repository->create([
                'medication_schedule_id' => $dto->medication_schedule_id,
                'scheduled_time'         => $dto->scheduled_time,
                'actual_time'            => $dto->actual_time,
                'status'                 => $dto->status,
                'recorded_by'            => $dto->recorded_by,
                'notes'                  => $dto->notes,
            ]);
            return MedicationRecordResponseDTO::fromModel($record);
        });
    }
    public function updateRecord(int $id, UpdateMedicationRecordRequestDTO $dto): MedicationRecordResponseDTO
    {
        return $this->updateWithDto($id, $dto);
    }
    public function deleteRecord(int $id): bool
    {
        // Thay vì xóa vĩnh viễn, ta cập nhật trạng thái thành false
        return $this->delete($id);
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