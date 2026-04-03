<?php

namespace App\Services;

use App\DTOs\Requests\CreateMedicationScheduleRequestDTO;
use App\DTOs\Responses\MedicationScheduleResponseDTO;
use App\Repositories\Contracts\MedicationScheduleRepositoryInterface;
use Illuminate\Support\Facades\DB;

class MedicationScheduleService extends BaseService
{
    public function __construct(MedicationScheduleRepositoryInterface $scheduleRepository)
    {
        parent::__construct($scheduleRepository);
    }

    public function createSchedule(CreateMedicationScheduleRequestDTO $dto): MedicationScheduleResponseDTO
    {
        DB::beginTransaction();
        try {
            $schedule = $this->repository->create([
                'protocol_id' => $dto->protocol_id,
                'medicine_name' => $dto->medicine_name,
                'dosage' => $dto->dosage,
                'scheduled_at' => $dto->scheduled_at,
                'route' => $dto->route,
            ]);
            DB::commit();
            return MedicationScheduleResponseDTO::fromModel($schedule);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}