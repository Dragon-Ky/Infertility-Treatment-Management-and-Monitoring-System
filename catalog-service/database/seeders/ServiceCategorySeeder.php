<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ServiceCategory;

class ServiceCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Hỗ trợ sinh sản',
                'description' => 'Các phương pháp hỗ trợ thụ thai hiện đại như IUI, IVF.'
            ],
            [
                'name' => 'Khám & Chẩn đoán',
                'description' => 'Dịch vụ khám lâm sàng và xét nghiệm chuyên sâu.'
            ],
            [
                'name' => 'Sàng lọc di truyền',
                'description' => 'Các xét nghiệm sàng lọc trước sinh và chẩn đoán di truyền.'
            ],
        ];

        foreach ($categories as $category) {
            ServiceCategory::updateOrCreate(['name' => $category['name']], $category);
        }
    }
}
