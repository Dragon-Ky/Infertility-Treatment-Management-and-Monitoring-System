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
        $adminRole    = Role::updateOrCreate(['name' => 'Admin', 'guard_name' => 'api']);
        $managerRole  = Role::updateOrCreate(['name' => 'Manager', 'guard_name' => 'api']);
        $doctorRole  = Role::updateOrCreate(['name' => 'Doctor', 'guard_name' => 'api']);
        $customerRole = Role::updateOrCreate(['name' => 'Customer', 'guard_name' => 'api']);

        // 2. Tạo Admin
        $admin = User::updateOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'name'     => 'Hệ Thống Admin',
                'password' => Hash::make('Admin@123456'),
                'phone'    => '0111222333',
                'status'   => 1,
            ]
        );
        $admin->syncRoles($adminRole);

        // 3. Tạo Manager (Quản lý Doctor và Customer)
        $manager = User::updateOrCreate(
            ['email' => 'manager@gmail.com'],
            [
                'name'     => 'Quản Lý Khu Vực',
                'password' => Hash::make('Manager@123456'),
                'phone'    => '0222333444',
                'status'   => 1,
            ]
        );
        $manager->syncRoles($managerRole);

        // 4. Tạo Bác sĩ
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

        // 5. Tạo Khách hàng
        $customer = User::updateOrCreate(
            ['email' => 'customer@gmail.com'],
            [
                'name'     => 'Nguyễn Văn Khách',
                'password' => Hash::make('Customer@123456'),
                'phone'    => '0900112233',
                'status'   => 1,
            ]
        );
        $customer->syncRoles($customerRole);
    }
}
