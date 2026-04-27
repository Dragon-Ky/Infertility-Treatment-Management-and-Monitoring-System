<?php

namespace App\Http\Controllers\Api;

use App\Services\SpecimenRecordService;
use App\DTOs\Requests\CreateSpecimenRecordRequestDTO;
use App\DTOs\Requests\update\UpdateSpecimenRecordRequestDTO;

class SpecimenRecordController extends BaseApiController
{
    public function __construct(SpecimenRecordService $service)
    {
        parent::__construct($service);
    }

    protected function getStoreRules(): array
    {
        return [
            'treatment_id'       => 'required|integer',
            'type'               => 'required|in:embryo,egg,sperm',
            'specimen_code'      => 'required|string|unique:specimen_records,specimen_code',
            'fertilization_date' => 'nullable|date',
            'development_day'    => 'nullable|string|in:3,5,6',
            'grade'              => 'nullable|string',
            'status'             => 'required|in:fresh,frozen,used,discarded',
            'notes'              => 'nullable|string',
        ];
    }

    protected function getUpdateRules(): array
    {
        return [
            'treatment_id'       => 'nullable|integer',
            'type'               => 'nullable|in:embryo,egg,sperm',
            'specimen_code'      => 'nullable|string',
            'fertilization_date' => 'nullable|date',
            'development_day'    => 'nullable|string|in:3,5,6',
            'grade'              => 'nullable|string',
            'status'             => 'nullable|in:fresh,frozen,used,discarded',
            'notes'              => 'nullable|string',
        ];
    }

    protected function getCreateDtoClass(): string { return CreateSpecimenRecordRequestDTO::class; }
    protected function getUpdateDtoClass(): string { return UpdateSpecimenRecordRequestDTO::class; }
}
