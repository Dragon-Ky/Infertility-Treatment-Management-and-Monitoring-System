<?php

namespace App\Services;

use App\DTOs\Requests\CreateMedicationRecordRequestDTO;
use App\DTOs\Responses\MedicationRecordResponseDTO;
use App\DTOs\Requests\update\UpdateMedicationRecordRequestDTO;
use App\Repositories\Contracts\MedicationRecordRepositoryInterface;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class MedicationRecordService extends BaseService
{
    protected function getCacheKeyPrefix(): string
    {
        return 'medication_record';
    }
    protected function getResponseDtoClass(): string
    {
        return MedicationRecordResponseDTO::class;
    }
    public function __construct(MedicationRecordRepositoryInterface $repository)
    {
        parent::__construct($repository);
    }
    public function createRecord(CreateMedicationRecordRequestDTO $dto): MedicationRecordResponseDTO
    {
        return DB::transaction(function () use ($dto) {
            $record = $this->repository->create([
                'medication_schedule_id' => $dto->medication_schedule_id,
                'scheduled_time' => $dto->scheduled_time,
                'actual_time' => $dto->actual_time,
                'status' => $dto->status,
                'recorded_by' => $dto->recorded_by,
                'notes' => $dto->notes,
                'is_active'=> true,
            ]);
            $record->load('medicationSchedule');
            Cache::forget("medication_record:all_active");
            return MedicationRecordResponseDTO::fromModel($record);
        });
    }
    public function updateRecord(int $id, UpdateMedicationRecordRequestDTO $dto): MedicationRecordResponseDTO
    {
        return $this->updateWithDto($id, $dto);
    }
    public function deleteRecord(int $id): bool
    {
        // Thay vì xóa vĩnh viễn, ta cập nhật trạng thái thành false
        return $this->delete($id);
    }
    public function getRecordById(int $id): MedicationRecordResponseDTO
    {
        // Gọi trực tiếp từ $this->repository (vì bạn đã tiêm Interface vào construct rồi)
        /** @var MedicationRecordRepositoryInterface $repo */
        $repo = $this->repository;
        $record = $repo->getRecordWithSchedule($id);

        if (!$record) {
            // Nên thêm ID vào thông báo lỗi để dễ tìm kiếm lỗi sau này
            throw new \Exception("Không tìm thấy bản ghi uống thuốc với ID: $id");
        }

        return MedicationRecordResponseDTO::fromModel($record);
    }
    
}