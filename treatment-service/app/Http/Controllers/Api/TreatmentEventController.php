<?php

namespace App\Http\Controllers\Api;

use App\Services\TreatmentEventService;
use App\DTOs\Requests\CreateTreatmentEventRequestDTO;
use App\DTOs\Requests\Update\UpdateTreatmentEventRequestDTO;

class TreatmentEventController extends BaseApiController
{
    public function __construct(TreatmentEventService $service)
    {
        parent::__construct($service);
    }

    protected function getStoreRules(): array
    {
        return [
            'treatment_id' => 'required|integer',
            'event_type'   => 'required|in:egg_retrieval,embryo_transfer,insemination,ultrasound,blood_test,consultation,other',
            'event_date'   => 'required|date',
            'description'  => 'nullable|string',
            'result'       => 'nullable|string',
            'doctor_notes' => 'nullable|string',
            'attachments'  => 'nullable|array',
        ];
    }

    protected function getUpdateRules(): array
    {
        return [
            'result'       => 'nullable|string',
            'doctor_notes' => 'nullable|string',
            'attachments'  => 'nullable|array',
        ];
    }

    protected function getCreateDtoClass(): string { return CreateTreatmentEventRequestDTO::class; }
    protected function getUpdateDtoClass(): string { return UpdateTreatmentEventRequestDTO::class; }
}