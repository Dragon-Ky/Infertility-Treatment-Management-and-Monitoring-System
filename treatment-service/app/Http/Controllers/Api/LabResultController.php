<?php

namespace App\Http\Controllers\Api;

use App\Services\LabResultService;
use App\DTOs\Requests\CreateLabResultRequestDTO;
use App\DTOs\Requests\Update\UpdateLabResultRequestDTO;

class LabResultController extends BaseApiController
{
    public function __construct(LabResultService $service)
    {
        parent::__construct($service);
    }

    protected function getStoreRules(): array
    {
        return [
            'treatment_id'    => 'required|integer',
            'test_type'       => 'required|in:blood,ultrasound,hormone,spermogram,other',
            'test_date'       => 'required|date',
            'result_data'     => 'required|array',
            'reference_range' => 'nullable|string',
            'unit'            => 'nullable|string',
            'doctor_notes'    => 'nullable|string',
        ];
    }

    protected function getUpdateRules(): array
    {
        return [
            'treatment_id'    => 'nullable|integer',
            'test_type'       => 'nullable|in:blood,ultrasound,hormone,spermogram,other',
            'test_date'       => 'nullable|date',
            'result_data'     => 'nullable|array',
            'reference_range' => 'nullable|string',
            'unit'            => 'nullable|string',
            'doctor_notes'    => 'nullable|string',
        ];
    }

    protected function getCreateDtoClass(): string
    {
        return CreateLabResultRequestDTO::class;
    }

    protected function getUpdateDtoClass(): string
    {
        return UpdateLabResultRequestDTO::class;
    }
}