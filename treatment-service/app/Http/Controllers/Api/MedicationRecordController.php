<?php

namespace App\Http\Controllers\Api;

use App\Services\MedicationRecordService;
use App\DTOs\Requests\CreateMedicationRecordRequestDTO;
use App\DTOs\Requests\Update\UpdateMedicationRecordRequestDTO;

class MedicationRecordController extends BaseApiController
{
    public function __construct(MedicationRecordService $service)
    {
        parent::__construct($service);
    }

    protected function getStoreRules(): array
    {
        return [
            'medication_schedule_id' => 'required|integer',
            'scheduled_time'         => 'required|date',
            'actual_time'            => 'required|date',
            'status'                 => 'required|in:taken,missed,skipped',
            'recorded_by'            => 'required|integer',
            'notes'                  => 'nullable|string',
        ];
    }

    protected function getUpdateRules(): array
    {
        return [
            'actual_time' => 'nullable|date',
            'status'      => 'nullable|in:taken,missed,skipped',
            'notes'       => 'nullable|string',
        ];
    }

    protected function getCreateDtoClass(): string { return CreateMedicationRecordRequestDTO::class; }
    protected function getUpdateDtoClass(): string { return UpdateMedicationRecordRequestDTO::class; }
}