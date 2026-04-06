<?php

namespace App\Services;

use App\DTOs\Requests\CreateEmbryoRecordRequestDTO;
use App\DTOs\Responses\EmbryoRecordResponseDTO;
use App\DTOs\Requests\update\UpdateEmbryoRecordRequestDTO;
use App\Repositories\Contracts\EmbryoRecordRepositoryInterface;
use Illuminate\Support\Facades\DB;


class EmbryoRecordService extends BaseService
{
    public function __construct(EmbryoRecordRepositoryInterface $repository) 
    {
        parent::__construct($repository);
    }

    public function createEmbryo(CreateEmbryoRecordRequestDTO $dto): EmbryoRecordResponseDTO
    {
        return DB::transaction(function () use ($dto) {
            $embryo = $this->repository->create([
                'treatment_id'       => $dto->treatment_id,
                'embryo_code'        => $dto->embryo_code,
                'fertilization_date' => $dto->fertilization_date,
                'development_day'    => $dto->development_day,
                'grade'              => $dto->grade,
                'status'             => $dto->status,
                'notes'              => $dto->notes,
            ]);
            return EmbryoRecordResponseDTO::fromModel($embryo);
        });
    }
     public function updateEmbryo(int $id, UpdateEmbryoRecordRequestDTO $dto): EmbryoRecordResponseDTO
    {
        return $this->updateWithDto($id, $dto);
    }
    public function deleteEmbryoRecord(int $id): bool
    {
        // Thay vì xóa vĩnh viễn, ta cập nhật trạng thái thành false
        return $this->delete($id);
    }
    public function getEmbryoRecordById(int $id): EmbryoRecordResponseDTO
    {
        $embryo = $this->repository->find($id);
        return EmbryoRecordResponseDTO::fromModel($embryo);
    }
    public function getResponseDtoClass(): string
    {
        return EmbryoRecordResponseDTO::class;
    }
}