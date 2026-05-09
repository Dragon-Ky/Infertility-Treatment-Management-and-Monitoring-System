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
        $adminRole = Role::updateOrCreate(['name' => 'Admin', 'guard_name' => 'api']);
        $managerRole = Role::updateOrCreate(['name' => 'Manager', 'guard_name' => 'api']);
        $doctorRole = Role::updateOrCreate(['name' => 'Doctor', 'guard_name' => 'api']);
        $customerRole = Role::updateOrCreate(['name' => 'Customer', 'guard_name' => 'api']);

        // 2. Tạo Admin
        $admin = User::updateOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'name' => 'Hệ Thống Admin',
                'password' => Hash::make('Admin@123456'),
                'phone' => '0111222333',
                'status' => 1,
            ]
        );
        $admin->syncRoles($adminRole);

        // 3. Tạo Manager (Quản lý Doctor và Customer)
        $manager = User::updateOrCreate(
            ['email' => 'manager@gmail.com'],
            [
                'name' => 'Quản Lý Khu Vực',
                'password' => Hash::make('Manager@123456'),
                'phone' => '0222333444',
                'status' => 1,
            ]
        );
        $manager->syncRoles($managerRole);

        // 4. Tạo Bác sĩ
        $doctors = [
            ['email' => 'thao.nguyen@gmail.com', 'name' => 'Nguyễn Thanh Thảo'],
            ['email' => 'nam.tran@gmail.com', 'name' => 'Trần Văn Nam'],
            ['email' => 'anh.le@gmail.com', 'name' => 'Lê Thị Phương Anh'],
            ['email' => 'hoang.pham@gmail.com', 'name' => 'Phạm Minh Hoàng'],
            ['email' => 'doctor@gmail.com', 'name' => 'Bác sĩ chuyên khoa'],
        ];

        foreach ($doctors as $docData) {
            $doc = User::updateOrCreate(
                ['email' => $docData['email']],
                [
                    'name' => $docData['name'],
                    'password' => Hash::make('Doctor@123456'),
                    'phone' => '0987' . rand(100000, 999999),
                    'status' => 1,
                ]
            );
            $doc->syncRoles($doctorRole);
        }

        // 5. Tạo Khách hàng
        $customers = [
            ['email' => 'customer@gmail.com', 'name' => 'Nguyễn Văn Khách'],
            ['email' => 'thuan@gmail.com', 'name' => 'Lê Văn Thuận'],
            ['email' => 'hoa@gmail.com', 'name' => 'Nguyễn Thị Hoa'],
        ];

        foreach ($customers as $cusData) {
            $cus = User::updateOrCreate(
                ['email' => $cusData['email']],
                [
                    'name' => $cusData['name'],
                    'password' => Hash::make('Customer@123456'),
                    'phone' => '0900' . rand(100000, 999999),
                    'status' => 1,
                ]
            );
            $cus->syncRoles($customerRole);
        }
    }
}
