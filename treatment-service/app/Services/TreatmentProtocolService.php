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
        return DB::transaction(function () use ($id, $dto) {
            // 1. Lọc bỏ các giá trị null: Chỉ giữ lại những gì người dùng muốn sửa
            $data = array_filter((array) $dto, fn($value) => !is_null($value));

            // 2. Cập nhật thông qua Repository
            $protocol = $this->repository->update($id, $data);

            // 3. Trả về kết quả đã định dạng (Laravel tự động commit nếu chạy đến đây)
            return TreatmentProtocolResponseDTO::fromModel($protocol);
        });
    }
    }