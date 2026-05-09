<?php

namespace App\Http\Controllers\Api;

use App\Services\PregnancyTrackingService;
use App\DTOs\Requests\CreatePregnancyTrackingRequestDTO;
use App\DTOs\Requests\Update\UpdatePregnancyTrackingRequestDTO;

class PregnancyTrackingController extends BaseApiController
{
    public function __construct(PregnancyTrackingService $service)
    {
        parent::__construct($service);
    }

    protected function getStoreRules(): array
    {
        return [
            'treatment_id'  => 'required|integer',
            'tracking_date' => 'required|date',
            'week_number'   => 'required|integer|min:0|max:42',
            'status'        => 'required|in:ongoing,delivered,miscarried',
            'notes'         => 'nullable|string',
        ];
    }

    protected function getUpdateRules(): array
    {
        return [
            'treatment_id'  => 'nullable|integer',
            'tracking_date' => 'nullable|date',
            'week_number'   => 'nullable|integer|min:0',
            'status'        => 'nullable|in:ongoing,delivered,miscarried',
            'notes'         => 'nullable|string',
        ];
    }

    protected function getCreateDtoClass(): string { return CreatePregnancyTrackingRequestDTO::class; }
    protected function getUpdateDtoClass(): string { return UpdatePregnancyTrackingRequestDTO::class; }
}