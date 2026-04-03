<?php

namespace App\Services;

use App\DTOs\Requests\CreateTreatmentEventRequestDTO;
use App\DTOs\Responses\TreatmentEventResponseDTO;
use App\Repositories\Contracts\TreatmentEventRepositoryInterface;
use Illuminate\Support\Facades\DB;

class TreatmentEventService extends BaseService
{
    // Lấy đúng kho chứa sự kiện
    public function __construct(TreatmentEventRepositoryInterface $eventRepository)
    {
        parent::__construct($eventRepository);
    }

    // Hàm tạo sự kiện mới
    public function createEvent(CreateTreatmentEventRequestDTO $dto): TreatmentEventResponseDTO
    {
        DB::beginTransaction();
        try {
            // Nhờ Thủ kho cất dữ liệu vào DB
            $event = $this->repository->create([
                'protocol_id' => $dto->protocol_id,
                'event_type' => $dto->event_type,
                'title' => $dto->title,
                'event_datetime' => $dto->event_datetime,
                'result_summary' => $dto->result_summary,
                'location' => $dto->location,
            ]);

            DB::commit();
            
            // Format lại dữ liệu cho đẹp rồi trả về
            return TreatmentEventResponseDTO::fromModel($event);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    // Hàm lấy danh sách sự kiện theo phác đồ (Cho Frontend hiển thị Timeline)
    public function getEventsByProtocol(int $protocolId): array
    {
        // Trong thực tế, bạn sẽ thêm hàm getByProtocolId vào Repository. 
        // Ở đây ta dùng hàm all() cơ bản và lọc ra.
        $events = $this->repository->all()->where('protocol_id', $protocolId);
        
        $result = [];
        foreach ($events as $event) {
            $result[] = TreatmentEventResponseDTO::fromModel($event)->toArray();
        }
        return $result;
    }
}