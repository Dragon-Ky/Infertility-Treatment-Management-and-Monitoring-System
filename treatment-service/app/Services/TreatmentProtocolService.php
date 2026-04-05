<?php

namespace App\Services;

use App\DTOs\Requests\CreateTreatmentProtocolRequestDTO;
use App\DTOs\Requests\update\UpdateTreatmentProtocolRequestDTO;

use App\DTOs\Responses\TreatmentProtocolResponseDTO;
use App\Repositories\Contracts\TreatmentProtocolRepositoryInterface;
use Illuminate\Support\Facades\DB;


class TreatmentProtocolService
{
    public function __construct(protected TreatmentProtocolRepositoryInterface $repository) {}

    public function createProtocol(CreateTreatmentProtocolRequestDTO $dto): TreatmentProtocolResponseDTO
    {
        DB::beginTransaction();
        try {
            $protocol = $this->repository->create([
                'treatment_id' => $dto->treatment_id,
                'doctor_id'    => $dto->doctor_id,
                'protocol_name'=> $dto->protocol_name,
                'diagnosis'    => $dto->diagnosis,
                'prescription' => $dto->prescription,
                'notes'        => $dto->notes,
            ]);
            DB::commit();
            return TreatmentProtocolResponseDTO::fromModel($protocol);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
    
    public function updateProtocol(int $id, UpdateTreatmentProtocolRequestDTO $dto): TreatmentProtocolResponseDTO
    {
        DB::beginTransaction();
        try {
            // 1. Chuyển DTO thành mảng và loại bỏ các giá trị null (không muốn sửa)
            $data = array_filter((array) $dto, fn($value) => !is_null($value));

            // 2. Nhờ Repository cập nhật vào Database
            $protocol = $this->repository->update($id, $data);

            DB::commit();

            // 3. Trả về kết quả đã được format 
            return TreatmentProtocolResponseDTO::fromModel($protocol);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}