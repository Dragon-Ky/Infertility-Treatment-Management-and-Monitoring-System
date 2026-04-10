<?php

namespace App\Services;

use App\DTOs\Requests\CreateTreatmentEventRequestDTO;
use App\DTOs\Responses\TreatmentEventResponseDTO;
use App\DTOs\Requests\update\UpdateTreatmentEventRequestDTO;
use App\Repositories\Contracts\TreatmentEventRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
class TreatmentEventService extends BaseService
{
    protected function getCacheKeyPrefix(): string
    {
        return 'treatment_event';
    }
    protected function getResponseDtoClass(): string
    {
        return TreatmentEventResponseDTO::class;
    }
    // 1. Khởi tạo: Lấy đúng "Thủ kho" chuyên quản lý Sự kiện điều trị
    public function __construct(TreatmentEventRepositoryInterface $eventRepository)
    {
        parent::__construct($eventRepository);
    }

    /**
     * 2. Hàm tạo sự kiện mới (Ví dụ: Ghi nhận một ca chọc trứng)
     */
    public function createEvent(CreateTreatmentEventRequestDTO $dto): TreatmentEventResponseDTO
    {
        return DB::transaction(function () use ($dto) {
            $event = $this->repository->create([
                'treatment_id' => $dto->treatment_id,
                'event_type'   => $dto->event_type,
                'event_date'   => $dto->event_date,
                'description'  => $dto->description,
                'result'       => $dto->result,
                'doctor_notes' => $dto->doctor_notes,
                'attachments'  => $dto->attachments,
            ]);
            Cache::forget("embryo:all_active");
            return TreatmentEventResponseDTO::fromModel($event);
        });
    }

    /**
     * 3. Hàm lấy danh sách sự kiện theo đợt điều trị (Để hiện Timeline)
     */
    public function getEventsByTreatment(int $treatmentId): array
    {
        // Lấy tất cả sự kiện thuộc về treatment_id này
        $events = $this->repository->all()->where('treatment_id', $treatmentId);
        
        $result = [];
        foreach ($events as $event) {
            // Biến mỗi dòng dữ liệu thành một "Gói quà" ResponseDTO gọn gàng
            $result[] = TreatmentEventResponseDTO::fromModel($event)->toArray();
        }
        return $result;
    }
    public function updateEvent(int $id, UpdateTreatmentEventRequestDTO $dto): TreatmentEventResponseDTO
    {
        return $this->updateWithDto($id, $dto);
    }
    public function deleteEvent(int $id): bool
    {
        // Thay vì xóa vĩnh viễn, ta cập nhật trạng thái thành false
        return $this->delete($id);
    }
    public function getEventById(int $id): TreatmentEventResponseDTO
    {
        $event = $this->repository->find($id);
        return TreatmentEventResponseDTO::fromModel($event);
    }
    
}