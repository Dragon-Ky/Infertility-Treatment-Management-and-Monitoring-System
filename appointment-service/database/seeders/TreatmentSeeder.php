<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Treatment;
use App\Models\Appointment;
use Carbon\Carbon;

class TreatmentSeeder extends Seeder
{
    public function run(): void
    {
        for ($i = 1; $i <= 5; $i++) {
            $startDate = Carbon::now()->addDays(rand(-5, 5));
            
            $treatment = Treatment::create([
                'user_id'           => rand(1, 10),
                'doctor_id'         => rand(1, 5),
                'service_id'        => rand(1, 3),
                'treatment_name'    => 'Phác đồ điều trị IVF - Mã số ' . $i,
                'treatment_type'    => ['ivf', 'iui', 'icsi'][rand(0, 2)],
                'status'            => 'in_progress',
                'start_date'        => $startDate->toDateString(),
                'expected_end_date' => $startDate->copy()->addDays(30)->toDateString(),
                'total_cost'        => 80000000.00,
                'paid_amount'       => 35000000.00,
                'notes'             => 'Bệnh nhân sức khỏe ổn định, cần theo dõi nồng độ hormone.'
            ]);

            // Tạo các mốc khám thực tế cho phác đồ này
            $milestones = [
                ['type' => 'consultation', 'gap' => 0, 'desc' => 'Khám tư vấn ban đầu'],
                ['type' => 'blood_test',   'gap' => 2, 'desc' => 'Xét nghiệm máu tổng quát'],
                ['type' => 'ultrasound',   'gap' => 5, 'desc' => 'Siêu âm nang noãn'],
                ['type' => 'injection',    'gap' => 7, 'desc' => 'Tiêm thuốc kích trứng'],
                ['type' => 'egg_retrieval','gap' => 14, 'desc' => 'Chọc hút trứng'],
            ];

            foreach ($milestones as $ms) {
                Appointment::create([
                    'treatment_id'     => $treatment->id,
                    'user_id'          => $treatment->user_id,
                    'doctor_id'        => $treatment->doctor_id,
                    'appointment_date' => $startDate->copy()->addDays($ms['gap'])->toDateString(),
                    'appointment_time' => '08:30:00',
                    'type'             => $ms['type'],
                    'status'           => $ms['gap'] < 0 ? 'completed' : 'scheduled',
                    'notes'            => $ms['desc']
                ]);
            }
        }
    }
}