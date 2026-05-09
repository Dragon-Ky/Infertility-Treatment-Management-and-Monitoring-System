<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Doctor;

class DoctorSeeder extends Seeder
{
    public function run(): void
    {
        $doctors = [
            [
                'id' => 3,
                'full_name' => 'Nguyễn Thanh Thảo',
                'avatar' => 'https://www.fvhospital.com/wp-content/uploads/2018/09/drminhhien.jpg',
                'degree' => 'ThS.BS',
                'specialization' => 'Trưởng khoa Hỗ trợ sinh sản (IVF)',
                'experience_years' => 15,
                'bio' => 'Chuyên gia hàng đầu trong lĩnh vực thụ tinh ống nghiệm.',
                'consultation_fee' => 500000,
                'rating_avg' => 4.9,
                'rating_count' => 120,
            ],
            [
                'id' => 4,
                'full_name' => 'Trần Văn Nam',
                'avatar' => 'https://img.freepik.com/free-photo/doctor-hospital_1098-19685.jpg',
                'degree' => 'TS.BS',
                'specialization' => 'Chuyên gia Phẫu thuật Nội soi & Hiếm muộn',
                'experience_years' => 20,
                'bio' => 'Kinh nghiệm dày dặn trong phẫu thuật nội soi điều trị vô sinh.',
                'consultation_fee' => 700000,
                'rating_avg' => 4.8,
                'rating_count' => 85,
            ],
            [
                'id' => 5,
                'full_name' => 'Lê Thị Phương Anh',
                'avatar' => 'https://img.freepik.com/free-photo/portrait-woman-working-healthcare-system-as-pediatrician_23-2151686712.jpg?semt=ais_rp_50_assets&w=740&q=80',
                'degree' => 'ThS.BS',
                'specialization' => 'Bác sĩ chuyên khoa Phụ sản & Vô sinh nam',
                'experience_years' => 12,
                'bio' => 'Tận tâm trong điều trị vô sinh nam và các bệnh lý phụ khoa.',
                'consultation_fee' => 400000,
                'rating_avg' => 4.7,
                'rating_count' => 60,
            ],
            [
                'id' => 6,
                'full_name' => 'Phạm Minh Hoàng',
                'avatar' => 'https://www.fvhospital.com/wp-content/uploads/2020/10/Dr-Tran-Xuan-Tiem-5028.jpg',
                'degree' => 'BS. CKII',
                'specialization' => 'Chuyên gia Di truyền học & Sàng lọc phôi',
                'experience_years' => 18,
                'bio' => 'Chuyên gia sàng lọc di truyền tiền làm tổ.',
                'consultation_fee' => 600000,
                'rating_avg' => 5.0,
                'rating_count' => 45,
            ],
            [
                'id' => 7,
                'full_name' => 'Bác sĩ chuyên khoa',
                'avatar' => 'https://www.shutterstock.com/image-photo/medical-concept-indian-handsome-male-600nw-2115160898.jpg',
                'degree' => 'BS',
                'specialization' => 'Hỗ trợ sinh sản',
                'experience_years' => 10,
                'bio' => 'Bác sĩ hỗ trợ tư vấn chung cho khách hàng.',
                'consultation_fee' => 300000,
                'rating_avg' => 4.5,
                'rating_count' => 30,
            ],
        ];

        foreach ($doctors as $doctor) {
            Doctor::withTrashed()->updateOrCreate(['id' => $doctor['id']], $doctor);
        }
    }
}
