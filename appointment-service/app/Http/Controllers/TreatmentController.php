<?php

namespace App\Http\Controllers;

use App\Models\Treatment;
use App\Models\Appointment;
use App\Services\RabbitMQService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;
use Exception;

class TreatmentController extends Controller
{
    protected $rabbitmq;

    public function __construct(RabbitMQService $rabbitmq)
    {
        $this->rabbitmq = $rabbitmq;
    }

    /**
     * 1. Xem lịch trình điều trị của bệnh nhân
     * Tích hợp Redis Cache để tải lộ trình IVF/IUI nhanh hơn
     */
    public function show($id)
    {
        $cacheKey = "treatment_detail_{$id}";

        return Cache::remember($cacheKey, 3600, function () use ($id) {
            // Lấy phác đồ kèm theo tất cả các lịch hẹn (siêu âm, tiêm, chọc trứng...)
            $treatment = Treatment::with(['appointments' => function($query) {
                $query->orderBy('appointment_date', 'asc')
                      ->orderBy('appointment_time', 'asc');
            }])->find($id);

            if (!$treatment) return response()->json(['msg' => 'Not found'], 404);

            return response()->json($treatment);
        });
    }

    /**
     * 2. Đăng ký phác đồ điều trị mới
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required',
            'doctor_id' => 'required',
            'service_id' => 'required',
            'treatment_type' => 'required|in:iui,ivf,icsi,screening',
            'start_date' => 'required|date',
        ]);

        if ($validator->fails()) return response()->json($validator->errors(), 400);

        try {
            $treatment = Treatment::create($request->all());

            // Public sự kiện sang RabbitMQ để các Service khác (ví dụ Notification) xử lý
            $this->rabbitmq->publish('treatment.created', $treatment->toArray());

            return response()->json([
                'message' => 'Phác đồ đã được khởi tạo',
                'data' => $treatment
            ], 201);
        } catch (Exception $e) {
            return response()->json(['message' => 'Lỗi: ' . $e->getMessage()], 500);
        }
    }

    /**
     * 3. Cập nhật trạng thái điều trị
     */
    public function updateStatus(Request $request, $id)
    {
        $treatment = Treatment::find($id);
        if (!$treatment) return response()->json(['msg' => 'Not found'], 404);

        $treatment->update($request->only(['status', 'actual_end_date', 'paid_amount', 'notes']));

        // Xóa cache cũ để hiển thị trạng thái mới nhất
        Cache::forget("treatment_detail_{$id}");

        // Thông báo cập nhật cho hệ thống
        $this->rabbitmq->publish('treatment.updated', $treatment->toArray());

        return response()->json(['message' => 'Status updated', 'data' => $treatment]);
    }

    public function getReminders($id)
    {
        // Lấy các lịch hẹn chưa diễn ra của phác đồ này
        $reminders = Appointment::where('treatment_id', $id)
            ->where('appointment_date', '>=', now()->toDateString())
            ->where('status', 'scheduled')
            ->orderBy('appointment_date', 'asc')
            ->get();

        return response()->json([
            'treatment_id' => $id,
            'reminders_count' => $reminders->count(),
            'data' => $reminders
        ]);
    }

    // Admin methods
    public function allTreatments()
    {
        $treatments = Treatment::with(['appointments' => function($query) {
            $query->orderBy('appointment_date', 'asc');
        }])->get();

        return response()->json($treatments);
    }
    public function getTreatmentsByIds(Request $request)
    {
        $ids = $request->input('ids');
        if (!$ids || !is_array($ids)) {
            return response()->json(['status' => 'error', 'message' => 'IDs are required'], 400);
        }

        $treatments = Treatment::whereIn('id', $ids)
            ->select('id', 'user_id', 'doctor_id', 'treatment_type', 'status')
            ->get()
            ->keyBy('id');

        return response()->json([
            'status' => 'success',
            'data' => $treatments
        ]);
    }
}
