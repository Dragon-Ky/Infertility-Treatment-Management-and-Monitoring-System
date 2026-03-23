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
        // 1. Tạo Role (nếu chưa có)
        $adminRole = Role::updateOrCreate(['name' => 'Admin']);
        $doctorRole = Role::updateOrCreate(['name' => 'Doctor']);

        // 2. Tạo tài khoản Admin
        $admin = User::updateOrCreate(
            ['email' => 'admin@gmail.com'],
            ['name' => 'Quản trị viên', 'password' => Hash::make('password')]
        );
        $admin->assignRole($adminRole);

        // 3. Tạo tài khoản Bác sĩ
        $doctor = User::updateOrCreate(
            ['email' => 'doctor@gmail.com'],
            ['name' => 'Bác sĩ chuyên khoa', 'password' => Hash::make('password')]
        );
        $doctor->assignRole($doctorRole);
    }
}
