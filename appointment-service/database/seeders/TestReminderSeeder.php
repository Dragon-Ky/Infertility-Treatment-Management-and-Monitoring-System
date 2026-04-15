<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Appointment;
use Carbon\Carbon;

class TestReminderSeeder extends Seeder
{
    public function run(): void
    {
        // Tạo 1 lịch hẹn đặc biệt diễn ra sau 45 phút nữa
        Appointment::create([
            'user_id'          => 1, // Hãy đảm bảo User ID này có FCM Token trong Redis
            'doctor_id'        => 2,
            'appointment_date' => Carbon::now()->toDateString(),
            'appointment_time' => Carbon::now()->addMinutes(45)->toTimeString(),
            'type'             => 'ultrasound',
            'status'           => 'scheduled',
            'notes'            => 'Dữ liệu Test chức năng nhắc lịch tự động 60 phút'
        ]);
    }
}