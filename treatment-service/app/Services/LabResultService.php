<?php

namespace App\Services;

use App\DTOs\Requests\CreateLabResultRequestDTO;
use App\DTOs\Responses\LabResultResponseDTO;
use App\DTOs\Requests\update\UpdateLabResultRequestDTO;
use App\Repositories\Contracts\LabResultRepositoryInterface;
use Illuminate\Support\Facades\DB;

class LabResultService
{
    public function __construct(protected LabResultRepositoryInterface $repository) {}

    public function createLabResult(CreateLabResultRequestDTO $dto): LabResultResponseDTO
    {
        DB::beginTransaction();
        try {
            $lab = $this->repository->create([
                'treatment_id'    => $dto->treatment_id,
                'test_type'       => $dto->test_type,
                'test_date'       => $dto->test_date,
                'result_data'     => $dto->result_data,
                'reference_range' => $dto->reference_range,
                'unit'            => $dto->unit,
                'notes'           => $dto->notes,
                'doctor_notes'    => $dto->doctor_notes,
                'attachments'     => $dto->attachments,
            ]);
            DB::commit();
            return LabResultResponseDTO::fromModel($lab);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
    public function updateLabResult(int $id, UpdateLabResultRequestDTO $dto): LabResultResponseDTO
    {
        return DB::transaction(function () use ($id, $dto) {
            $data = array_filter((array) $dto, fn($value) => !is_null($value));
            $lab = $this->repository->update($id, $data);
            return LabResultResponseDTO::fromModel($lab);
        });
    }
    public function deleteLabResult(int $id): bool
    {
        // Thay vì xóa vĩnh viễn, ta cập nhật trạng thái thành false
        return $this->deleteLabResult($id);
    }
    public function getLabResultById(int $id): LabResultResponseDTO
    {
        $lab = $this->repository->find($id);
        return LabResultResponseDTO::fromModel($lab);
    }
}