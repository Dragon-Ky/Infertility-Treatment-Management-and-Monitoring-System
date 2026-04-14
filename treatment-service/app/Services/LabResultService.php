<?php

namespace App\Services;

use App\DTOs\Requests\CreateLabResultRequestDTO;
use App\DTOs\Responses\LabResultResponseDTO;
use App\DTOs\Requests\update\UpdateLabResultRequestDTO;
use App\Repositories\Contracts\LabResultRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

use function Symfony\Component\Translation\t;

class LabResultService extends BaseService
{
    protected function getCacheKeyPrefix(): string
    {
        return 'lab_result';
    }
    protected function getResponseDtoClass(): string
    {
        return LabResultResponseDTO::class;
    }
    public function __construct(LabResultRepositoryInterface $repository)
    {
        parent::__construct($repository);
    }

    public function createLabResult(CreateLabResultRequestDTO $dto): LabResultResponseDTO
    {
        return DB::transaction(function () use ($dto) { 
            $lab = $this->repository->create([
                'treatment_id'    => $dto->treatment_id,
                'test_type'       => $dto->test_type,
                'test_date'       => $dto->test_date,
                'result_data'     => $dto->result_data,
                'reference_range' => $dto->reference_range,
                'unit'            => $dto->unit,
                'doctor_notes'    => $dto->doctor_notes,
                'is_active'       => true,
            ]);   
            Cache::forget("lab_result:all_active");
            return LabResultResponseDTO::fromModel($lab);  
        });
    }

    public function updateLabResult(int $id, UpdateLabResultRequestDTO $dto): LabResultResponseDTO
    {
        return $this->updateWithDto($id, $dto);
    }
    public function deleteLabResult(int $id): bool
    {
        // Thay vì xóa vĩnh viễn, ta cập nhật trạng thái thành false
        return $this->delete($id);
    }
    public function getLabResultById(int $id): LabResultResponseDTO
    {
        $lab = $this->repository->find($id);
        return LabResultResponseDTO::fromModel($lab);
    }
    
    
}