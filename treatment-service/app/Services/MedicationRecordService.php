<?php

namespace App\Services;

use App\DTOs\Responses\MedicationRecordResponseDTO;
use App\Repositories\Contracts\MedicationRecordRepositoryInterface;

class MedicationRecordService extends BaseService
{
    protected function getCacheKeyPrefix(): string { return 'medication_record'; }
    public function getResponseDtoClass(): string { return MedicationRecordResponseDTO::class; }

    public function __construct(MedicationRecordRepositoryInterface $repository)
    {
        parent::__construct($repository);
    }

    // Dặn lớp cha luôn nạp kèm thông tin lịch thuốc khi trả về dữ liệu
    protected function getRelationsToLoad(): array
    {
        return ['medicationSchedule'];
    }
}