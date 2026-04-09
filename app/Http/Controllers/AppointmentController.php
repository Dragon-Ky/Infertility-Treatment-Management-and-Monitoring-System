<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Services\RabbitMQService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AppointmentController extends Controller
{
    protected $rabbitmq;

    public function __construct(RabbitMQService $rabbitmq)
    {
        $this->rabbitmq = $rabbitmq;
    }

    // Lấy danh sách lịch hẹn (có thể lọc theo doctor_id hoặc user_id)
    public function index(Request $request)
    {
        $query = Appointment::query();
        if ($request->has('doctor_id')) $query->where('doctor_id', $request->doctor_id);
        if ($request->has('user_id')) $query->where('user_id', $request->user_id);

        return response()->json($query->get());
    }

    // Đăng ký lịch mới (Chọn bác sĩ qua doctor_id)
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required',
            'doctor_id' => 'required', // Đây chính là bước chọn bác sĩ
            'appointment_date' => 'required|date',
            'type' => 'required|string'
        ]);

        if ($validator->fails()) return response()->json($validator->errors(), 400);

        $appointment = Appointment::create($request->all());

        // Notify qua RabbitMQ
        $this->rabbitmq->publish('appointment.created', $appointment->toArray());

        return response()->json(['message' => 'Created successfully', 'data' => $appointment], 201);
    }

    // Cập nhật lịch hẹn (Đổi ngày, đổi bác sĩ)
    public function update(Request $request, $id)
    {
        $appointment = Appointment::find($id);
        if (!$appointment) return response()->json(['message' => 'Not found'], 404);

        $appointment->update($request->only(['doctor_id', 'appointment_date', 'appointment_time', 'status']));

        // Gửi event cập nhật
        $this->rabbitmq->publish('appointment.updated', $appointment->toArray());

        return response()->json(['message' => 'Updated successfully', 'data' => $appointment]);
    }

    // Hủy lịch hẹn (Xóa)
    public function destroy($id)
    {
        $appointment = Appointment::find($id);
        if (!$appointment) return response()->json(['message' => 'Not found'], 404);

        $appointment->delete();
        $this->rabbitmq->publish('appointment.deleted', ['id' => $id]);

        return response()->json(['message' => 'Deleted successfully']);
    }
}