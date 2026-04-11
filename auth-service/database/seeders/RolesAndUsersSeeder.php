<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;

class RolesAndUsersSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Tạo Roles
        $adminRole   = Role::updateOrCreate(['name' => 'Admin', 'guard_name' => 'api']);
        $doctorRole  = Role::updateOrCreate(['name' => 'Doctor', 'guard_name' => 'api']);
        $patientRole = Role::updateOrCreate(['name' => 'Patient', 'guard_name' => 'api']);

        // 2. Tạo Admin
        $admin = User::updateOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'name'     => 'Quản Trị Viên',
                'password' => Hash::make('Admin@123456'),
                'phone'    => '0123456789',
                'status'   => 1,
            ]
        );
        $admin->syncRoles($adminRole);

        // 3. Tạo Bác sĩ
        $doctor = User::updateOrCreate(
            ['email' => 'doctor@gmail.com'],
            [
                'name'     => 'Bác sĩ chuyên khoa',
                'password' => Hash::make('Doctor@123456'),
                'phone'    => '0987654321',
                'status'   => 1,
            ]
        );
        $doctor->syncRoles($doctorRole);

        // 4. Tạo Bệnh nhân
        $patient = User::updateOrCreate(
            ['email' => 'patient@gmail.com'],
            [
                'name'     => 'Nguyễn Văn Khách',
                'password' => Hash::make('Patient@123456'),
                'phone'    => '0900112233',
                'status'   => 1,
            ]
        );
        $patient->syncRoles($patientRole);
    }
}
