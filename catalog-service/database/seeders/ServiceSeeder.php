<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Service;
use App\Models\ServiceCategory;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $catSupport = ServiceCategory::firstOrCreate(
            ['name' => 'Hỗ trợ sinh sản'],
            ['description' => 'Các phương pháp hỗ trợ thụ thai hiện đại như IUI, IVF.']
        );
        $catDiagnose = ServiceCategory::firstOrCreate(
            ['name' => 'Khám & Chẩn đoán'],
            ['description' => 'Dịch vụ khám lâm sàng và xét nghiệm chuyên sâu.']
        );

        $services = [
            [
                'name' => 'IUI',
                'service_category_id' => $catSupport->id,
                'price' => 5000000,
                'description' => 'Kỹ thuật hỗ trợ sinh sản bằng cách chọn lọc những tinh trùng khỏe mạnh nhất để bơm trực tiếp vào buồng tử cung vào ngày rụng trứng, giúp tăng tỉ lệ thụ thai tự nhiên.'
            ],
            [
                'name' => 'IVF',
                'service_category_id' => $catSupport->id,
                'price' => 80000000,
                'description' => 'Phương pháp hiện đại giúp trứng và tinh trùng kết hợp trong phòng thí nghiệm để tạo thành phôi, sau đó phôi được chuyển lại vào tử cung của người mẹ.'
            ],
            [
                'name' => 'Khám lâm sàng',
                'service_category_id' => $catDiagnose->id,
                'price' => 300000,
                'description' => 'Quản lý thông tin khám lâm sàng và các kết quả xét nghiệm định kỳ.'
            ],
        ];

        foreach ($services as $service) {
            Service::updateOrCreate(['name' => $service['name']], $service);
        }
    }
}
