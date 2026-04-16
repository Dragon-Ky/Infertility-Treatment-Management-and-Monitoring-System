<?php

namespace App\Http\Controllers\Api;

use App\Services\StorageRecordService;
use App\DTOs\Requests\CreateStorageRecordRequestDTO;
use App\DTOs\Requests\Update\UpdateStorageRecordRequestDTO;

class StorageRecordController extends BaseApiController
{
    public function __construct(StorageRecordService $service)
    {
        parent::__construct($service);
    }

    protected function getStoreRules(): array
    {
        return [
            'treatment_id'  => 'required|integer',
            'storage_type'  => 'required|in:embryo,sperm,oocyte',
            'item_id'       => 'required|integer',
            'item_type'     => 'nullable|string',
            'start_date'    => 'required|date',
            'expiry_date'   => 'required|date|after:start_date',
            'location_code' => 'required|string|max:50',
        ];
    }

    protected function getUpdateRules(): array
    {
        return [
            'expiry_date'   => 'nullable|date',
            'status'        => 'nullable|in:active,expired,released',
            'location_code' => 'nullable|string',
        ];
    }

    protected function getCreateDtoClass(): string { return CreateStorageRecordRequestDTO::class; }
    protected function getUpdateDtoClass(): string { return UpdateStorageRecordRequestDTO::class; }
}