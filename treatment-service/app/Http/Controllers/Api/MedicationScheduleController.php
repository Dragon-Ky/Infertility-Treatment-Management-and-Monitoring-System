<?php

namespace App\Http\Controllers\Api;

use App\Services\MedicationScheduleService;
use App\DTOs\Requests\CreateMedicationScheduleRequestDTO;
use App\DTOs\Requests\Update\UpdateMedicationScheduleRequestDTO;

class MedicationScheduleController extends BaseApiController
{
    public function __construct(MedicationScheduleService $service)
    {
        parent::__construct($service);
    }

    protected function getStoreRules(): array
    {
        return [
            'treatment_id'    => 'required|integer',
            'medication_name' => 'required|string',
            'dosage'          => 'required|string',
            'frequency'       => 'required|string',
            'start_date'      => 'required|date',
            'end_date'        => 'required|date|after_or_equal:start_date',
            'time_slots'      => 'required|array',
            'route'           => 'required|in:injection,oral,vaginal,other',
        ];
    }

    protected function getUpdateRules(): array
    {
        return [
            'treatment_id'    => 'nullable|integer',
            'medication_name' => 'nullable|string',
            'dosage'          => 'nullable|string',
            'frequency'       => 'nullable|string',
            'status'          => 'nullable|in:active,completed,paused',
            'time_slots'      => 'nullable|array',
            'route'           => 'nullable|in:injection,oral,vaginal,other',
            'start_date'      => 'nullable|date',
            'end_date'        => 'nullable|date|after_or_equal:start_date',
        ];
    }

    protected function getCreateDtoClass(): string { return CreateMedicationScheduleRequestDTO::class; }
    protected function getUpdateDtoClass(): string { return UpdateMedicationScheduleRequestDTO::class; }
}