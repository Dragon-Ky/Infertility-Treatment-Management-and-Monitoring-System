<?php

namespace App\Services;

use App\DTOs\Requests\CreateMedicationScheduleRequestDTO;
use App\DTOs\Responses\MedicationScheduleResponseDTO;
use App\DTOs\Requests\update\UpdateMedicationScheduleRequestDTO;
use App\Repositories\Contracts\MedicationScheduleRepositoryInterface;
use Illuminate\Support\Facades\DB;


class MedicationScheduleService extends BaseService
{
    public function __construct( MedicationScheduleRepositoryInterface $repository) 
    {
        parent::__construct($repository);
    }
    public function createSchedule(CreateMedicationScheduleRequestDTO $dto): MedicationScheduleResponseDTO
    {
        return DB::transaction(function () use ($dto) {
            $schedule = $this->repository->create([
                'treatment_id'    => $dto->treatment_id,
                'medication_name' => $dto->medication_name,
                'dosage'          => $dto->dosage,
                'frequency'       => $dto->frequency,
                'start_date'      => $dto->start_date,
                'end_date'        => $dto->end_date,
                'time_slots'      => $dto->time_slots,
                'route'           => $dto->route,
                'status'          => 'active', 
            ]);
            return MedicationScheduleResponseDTO::fromModel($schedule);
        });
    }
    public function updateSchedule(int $id, UpdateMedicationScheduleRequestDTO $dto): MedicationScheduleResponseDTO
    {
        return $this->updateWithDto($id, $dto);
    }
    public function deleteSchedule(int $id): bool
    {
        // Thay vì xóa vĩnh viễn, ta cập nhật trạng thái thành false
        return $this->delete($id);
    }
    public function getScheduleById(int $id): MedicationScheduleResponseDTO
    {
        $schedule = $this->repository->find($id);
        return MedicationScheduleResponseDTO::fromModel($schedule);
    }
    public function getResponseDtoClass(): string
    {
        return MedicationScheduleResponseDTO::class;
    }
}