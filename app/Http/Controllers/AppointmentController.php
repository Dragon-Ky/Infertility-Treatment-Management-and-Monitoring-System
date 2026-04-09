<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Services\RabbitMQService;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    protected $rabbitmq;

    public function __construct(RabbitMQService $rabbitmq)
    {
        $this->rabbitmq = $rabbitmq;
    }

    public function store(Request $request)
    {
        $appointment = Appointment::create($request->all());

        // Gửi sự kiện appointment.created
        $this->rabbitmq->publish('appointment.created', [
            'appointment_id' => $appointment->id,
            'user_id' => $appointment->user_id,
            'doctor_id' => $appointment->doctor_id,
            'appointment_date' => $appointment->appointment_date,
            'appointment_time' => $appointment->appointment_time,
            'type' => $appointment->type
        ]);

        return response()->json(['message' => 'Lịch hẹn đã được tạo', 'data' => $appointment], 201);
    }
}