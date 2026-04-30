<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Services\RabbitMQService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Validator, Cache, Http};
use Exception;

class AppointmentController extends Controller
{
    protected $rabbitmq;

    public function __construct(RabbitMQService $rabbitmq)
    {
        $this->rabbitmq = $rabbitmq;
    }

    public function index(Request $request)
    {
       // 1. Lấy tham số tìm kiếm
        $userId = $request->user_id;
        $doctorId = $request->doctor_id;

        // 2. Truy vấn trực tiếp từ Database
        $query = Appointment::query();

        if ($userId) {
            $query->where('user_id', $userId);
        }
        if ($doctorId) {
            $query->where('doctor_id', $doctorId);
        }

        // 3. Ép kiểu trả về JSON chuẩn
        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id'          => 'required',
            'doctor_id'        => 'required',
            'appointment_date' => 'required|date|after_or_equal:today',
            'appointment_time' => 'required',
            'type'             => 'required|string'
        ]);

        if ($validator->fails()) return response()->json($validator->errors(), 400);

        // Kiểm tra bác sĩ bận
        if ($this->isDoctorBusy($request->doctor_id, $request->appointment_date, $request->appointment_time)) {
            return response()->json(['message' => 'Bác sĩ đã có lịch vào khung giờ này!'], 409);
        }

        try {
            $appointment = Appointment::create($request->all());

            $this->clearAppointmentCache($request->user_id, $request->doctor_id);

            // Notify
            $this->rabbitmq->publish('appointment.created', $appointment->toArray());
            $this->sendFirebaseNotification($request->user_id, "Đặt lịch thành công", "Lịch khám vào ngày {$request->appointment_date}");

            return response()->json(['message' => 'Created successfully', 'data' => $appointment], 201);
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $appointment = Appointment::find($id);
        if (!$appointment) return response()->json(['message' => 'Not found'], 404);

        // Nếu thay đổi thời gian/bác sĩ thì phải check bận lại
        if ($request->has('appointment_date') || $request->has('appointment_time')) {
            $date = $request->appointment_date ?? $appointment->appointment_date;
            $time = $request->appointment_time ?? $appointment->appointment_time;
            $docId = $request->doctor_id ?? $appointment->doctor_id;

            if ($this->isDoctorBusy($docId, $date, $time, $id)) {
                return response()->json(['message' => 'Khung giờ mới bác sĩ đã bận!'], 409);
            }
        }

        $appointment->update($request->only(['doctor_id', 'appointment_date', 'appointment_time', 'status', 'notes']));

        $this->clearAppointmentCache($appointment->user_id, $appointment->doctor_id);
        $this->rabbitmq->publish('appointment.updated', $appointment->toArray());

        return response()->json(['message' => 'Updated successfully', 'data' => $appointment]);
    }

    public function destroy($id)
    {
        $appointment = Appointment::find($id);
        if (!$appointment) return response()->json(['message' => 'Not found'], 404);

        $userId = $appointment->user_id;
        $doctorId = $appointment->doctor_id;

        $appointment->delete();
        $this->clearAppointmentCache($userId, $doctorId);
        $this->rabbitmq->publish('appointment.deleted', ['id' => $id]);

        return response()->json(['message' => 'Deleted successfully']);
    }

    // --- Hàm bổ trợ (Helper Functions) ---

    private function isDoctorBusy($doctorId, $date, $time, $excludeId = null)
    {
        $query = Appointment::where('doctor_id', $doctorId)
            ->where('appointment_date', $date)
            ->where('appointment_time', $time)
            ->whereIn('status', ['scheduled', 'confirmed']);

        if ($excludeId) $query->where('id', '!=', $excludeId);

        return $query->exists();
    }

    private function clearAppointmentCache($userId, $doctorId)
    {
        Cache::forget("appointments_u{$userId}_d{$doctorId}");
        Cache::forget("appointments_u_d"); // Xóa cả cache mặc định (nếu có)
    }

    private function sendFirebaseNotification($userId, $title, $body)
    {
        // Gửi thông báo qua RabbitMQ để NotificationService xử lý (FCM HTTP v1)
        // Điều này giúp tránh sử dụng Legacy FCM API đã bị Google khai tử
        $this->rabbitmq->publish('notification_queue', [
            'userId' => $userId,
            'templateName' => 'APPOINTMENT_EVENT',
            'variables' => [
                'title' => $title,
                'body'  => $body
            ]
        ]);
    }

    // Admin methods
    public function allAppointments()
    {
        $appointments = Appointment::with(['treatment'])->get();
        return response()->json($appointments);
    }
}
