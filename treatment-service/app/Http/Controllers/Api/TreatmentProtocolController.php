<?php

namespace App\Http\Controllers\Api;

use App\Services\TreatmentProtocolService;
use App\DTOs\Requests\CreateTreatmentProtocolRequestDTO;
use App\DTOs\Requests\Update\UpdateTreatmentProtocolRequestDTO;

class TreatmentProtocolController extends BaseApiController
{
    public function __construct(TreatmentProtocolService $service)
    {
        parent::__construct($service);
    }

    protected function getStoreRules(): array
    {
        return [
            'treatment_id'  => 'required|integer',
            'doctor_id'     => 'required|integer',
            'protocol_name' => 'required|string|max:255',
            'diagnosis'     => 'nullable|string',
            'prescription'  => 'nullable|string',
            'notes'         => 'nullable|string',
        ];
    }

    protected function getUpdateRules(): array
    {
        return [
            'doctor_id'     => 'nullable|integer',
            'protocol_name' => 'nullable|string|max:255',
            'diagnosis'     => 'nullable|string',
            'prescription'  => 'nullable|string',
            'notes'         => 'nullable|string',
        ];
    }

    protected function getCreateDtoClass(): string { return CreateTreatmentProtocolRequestDTO::class; }
    protected function getUpdateDtoClass(): string { return UpdateTreatmentProtocolRequestDTO::class; }
}