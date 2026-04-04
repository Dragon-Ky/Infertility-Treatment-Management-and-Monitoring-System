<?php

namespace App\Services;

use App\DTOs\Requests\CreateTreatmentEventRequestDTO;
use App\DTOs\Responses\TreatmentEventResponseDTO;
use App\Repositories\Contracts\TreatmentEventRepositoryInterface;
use Illuminate\Support\Facades\DB;

class TreatmentEventService extends BaseService
{
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
        DB::beginTransaction();
        try {
            // Nhờ Thủ kho cất dữ liệu vào đúng các ngăn (Cột) trong DB
            $event = $this->repository->create([
                'treatment_id' => $dto->treatment_id, // Gắn vào đúng đợt điều trị
                'event_type'   => $dto->event_type,   // Loại sự kiện (Siêu âm, xét nghiệm...)
                'event_date'   => $dto->event_date,   // Ngày giờ diễn ra
                'description'  => $dto->description,  // Mô tả chi tiết
                'result'       => $dto->result,       // Kết quả (nếu có)
                'doctor_notes' => $dto->doctor_notes, // Ghi chú của bác sĩ
                'attachments'  => $dto->attachments,  // Danh sách file/ảnh đính kèm
            ]);

            DB::commit();
            
            // Chuyển đổi dữ liệu thô từ DB sang dạng đẹp (DTO) để trả về cho Frontend
            return TreatmentEventResponseDTO::fromModel($event);
        } catch (\Exception $e) {
            DB::rollBack(); // Nếu có lỗi thì xóa bỏ mọi thứ vừa làm để dữ liệu không bị rác
            throw $e;
        }
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
}