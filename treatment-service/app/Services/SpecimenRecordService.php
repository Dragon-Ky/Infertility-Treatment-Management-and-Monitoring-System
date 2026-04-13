<?php

namespace App\Services;

use App\DTOs\Requests\CreateSpecimenRecordRequestDTO;
use App\DTOs\Responses\SpecimenRecordResponseDTO;
use App\DTOs\Requests\update\UpdateSpecimenRecordRequestDTO;
use App\Repositories\Contracts\SpecimenRecordRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;


class SpecimenRecordService extends BaseService
{
    protected function getCacheKeyPrefix(): string
    {
        return 'specimen_record';
    }
    protected function getResponseDtoClass(): string
    {
        return SpecimenRecordResponseDTO::class;
    }
    public function __construct(SpecimenRecordRepositoryInterface $repository) 
    {
        parent::__construct($repository);
    }

    public function createSpecimen(CreateSpecimenRecordRequestDTO $dto): SpecimenRecordResponseDTO
    {
        return DB::transaction(function () use ($dto) {
            $specimen = $this->repository->create([
                'treatment_id'       => $dto->treatment_id,
                'type'               => $dto->type,
                'specimen_code'      => $dto->specimen_code,
                'fertilization_date' => $dto->fertilization_date,
                'development_day'    => $dto->development_day,
                'grade'              => $dto->grade,
                'status'             => $dto->status,
                'notes'              => $dto->notes,
                'is_active'          => true,
            ]);   
            Cache::forget("specimen_record:all_active");
            return SpecimenRecordResponseDTO::fromModel($specimen);  
        });
    }

    public function updateSpecimen(int $id, UpdateSpecimenRecordRequestDTO $dto): SpecimenRecordResponseDTO
    {
        return $this->updateWithDto($id, $dto);
    }
    public function deleteSpecimen(int $id): bool
    {
        // Xóa logic
        return $this->delete($id);
    }
    public function getSpecimenById(int $id): SpecimenRecordResponseDTO
    {
        $specimen = $this->repository->find($id);
        return SpecimenRecordResponseDTO::fromModel($specimen);
    }
}
