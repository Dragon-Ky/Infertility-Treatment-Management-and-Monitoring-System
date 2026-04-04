<?php

namespace App\Services;

use App\DTOs\Requests\CreateMedicationScheduleRequestDTO;
use App\DTOs\Responses\MedicationScheduleResponseDTO;
use App\Repositories\Contracts\MedicationScheduleRepositoryInterface;
use Illuminate\Support\Facades\DB;

class MedicationScheduleService
{
    public function __construct(protected MedicationScheduleRepositoryInterface $repository) {}

    public function createSchedule(CreateMedicationScheduleRequestDTO $dto): MedicationScheduleResponseDTO
    {
        DB::beginTransaction();
        try {
            $schedule = $this->repository->create([
                'treatment_id'    => $dto->treatment_id,
                'medication_name' => $dto->medication_name,
                'dosage'          => $dto->dosage,
                'frequency'       => $dto->frequency,
                'start_date'      => $dto->start_date,
                'end_date'        => $dto->end_date,
                'time_slots'      => $dto->time_slots,
                'route'           => $dto->route,
                'status'          => 'active', // Mặc định khi tạo là active
            ]);
            DB::commit();
            return MedicationScheduleResponseDTO::fromModel($schedule);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}