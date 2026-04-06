<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Post;
use App\Models\User;
use Illuminate\Support\Str;

class PostSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Tìm tác giả (Ưu tiên Doctor, nếu không có lấy Admin, không có lấy User bất kỳ)
        $doctor = User::whereHas('roles', function($q) {
            $q->where('name', 'Doctor');
        })->first() ?: User::whereHas('roles', function($q) {
            $q->where('name', 'Admin');
        })->first() ?: User::first();

        if (!$doctor) {
            $this->command->error("Lỗi: Không tìm thấy bất kỳ User nào để gán quyền tác giả!");
            return;
        }

        $doctorId = $doctor->id;

        $posts = [
            [
                'title' => 'Cẩm nang chăm sóc sức khỏe toàn diện trước khi thực hiện IVF',
                'slug' => 'cam-nang-cham-soc-suc-khoe',
                'content' => "Việc chuẩn bị một nền tảng sức khỏe tốt là bước đệm quan trọng nhất cho sự thành công của một chu kỳ thụ tinh ống nghiệm (IVF). Dưới đây là những lưu ý quan trọng từ chuyên gia:\n\n" .
                             "### 1. Chế độ dinh dưỡng cân bằng\n" .
                             "Bạn nên bổ sung đầy đủ các nhóm chất, đặc biệt là Acid Folic ít nhất 3 tháng trước khi bắt đầu. Các loại thực phẩm như ngũ cốc nguyên hạt, rau xanh đậm và cá hồi là nguồn cung cấp omega-3 tuyệt vời cho chất lượng trứng.\n\n" .
                             "### 2. Quản lý tâm lý\n" .
                             "Stress là 'kẻ thù' âm thầm làm giảm tỷ lệ thành công. Hãy dành thời gian tập Yoga, thiền hoặc tham gia các câu lạc bộ hỗ trợ sinh sản để giữ tinh thần lạc quan.\n\n" .
                             "### 3. Sinh hoạt điều độ\n" .
                             "Cả hai vợ chồng nên hạn chế tối đa thuốc lá, rượu bia và chất kích thích. Ngủ đủ 8 tiếng mỗi ngày giúp nội tiết tố được cân bằng tự nhiên.",
                'image' => 'https://www.kidsplaza.vn/blog/wp-content/uploads/2025/08/raw-1024x683.png',
            ],
            [
                'title' => 'Hành trình 10 năm tìm con và cái kết viên mãn nhờ phương pháp mới',
                'slug' => 'hanh-trinh-10-nam-tim-con',
                'content' => "Câu chuyện của gia đình anh chị Minh - Hạnh (Hà Nội) là minh chứng cho sự kỳ diệu của y học và lòng kiên trì không bỏ cuộc.\n\n" .
                             "Sau 10 năm chạy chữa khắp nơi với 3 lần IUI thất bại, anh chị đã tìm đến trung tâm và được tư vấn thực hiện kỹ thuật ICSI (tiêm tinh trùng vào bào tương trứng).\n\n" .
                             "Chị Hạnh chia sẻ: 'Đã có những lúc tưởng chừng như muốn buông xuôi, nhưng nhờ sự động viên của bác sĩ và phác đồ cá nhân hóa, điều kỳ diệu đã đến ở lần chuyển phôi thứ 2'.\n\n" .
                             "Hiện tại, bé trai kháu khỉnh đã chào đời trong niềm hạnh phúc vỡ òa của cả dòng họ. Đây là nguồn động lực to lớn cho những gia đình vẫn đang trên con đường 'tìm con'.",
                'image' => 'https://img.lsvn.vn/resize/th/upload/2026/01/20/168599-639045077623056496-12092383.png',
            ],
            [
                'title' => 'Phân biệt phương pháp IUI và IVF: Lựa chọn nào phù hợp cho bạn?',
                'slug' => 'bac-si-chuyen-khoa-giai-thich',
                'content' => "Rất nhiều cặp đôi nhầm lẫn giữa bơm tinh trùng vào buồng tử cung (IUI) và thụ tinh ống nghiệm (IVF). Bác sĩ chuyên khoa giải thích chi tiết như sau:\n\n" .
                             "### IUI (Bơm tinh trùng)\n" .
                             "- Quy trình: Tinh trùng sau khi lọc rửa sẽ được bơm trực tiếp vào tử cung vào ngày rụng trứng.\n" .
                             "- Ưu điểm: Chi phí thấp, quy trình đơn giản, ít xâm lấn.\n" .
                             "- Đối tượng: Vợ chồng trẻ, vòi trứng thông, tinh trùng yếu nhẹ.\n\n" .
                             "### IVF (Thụ tinh ống nghiệm)\n" .
                             "- Quy trình: Trứng và tinh trùng được kết hợp trong phòng Lab để tạo phôi, sau đó mới đưa vào tử cung.\n" .
                             "- Ưu điểm: Tỷ lệ thành công cao vượt trội, giải quyết được các ca tắc vòi trứng hoặc tinh trùng quá yếu.\n\n" .
                             "Lựa chọn phương pháp nào sẽ phụ thuộc vào kết quả thăm khám và chỉ định riêng biệt cho từng trường hợp.",
                'image' => 'https://afhanoi.com/wp-content/uploads/2023/04/BS.CKI-Pham-Van-Huong-Pho-giam-doc-chuyen-mon-Benh-vien-Nam-hoc-va-Hiem-muon-Ha-Noi-kham-tu-van-cho-benh-nhan.jpg',
            ],
            [
                'title' => '7 dấu hiệu chuyển phôi thành công sau 14 ngày chờ đợi',
                'slug' => 'dau-hieu-chuyen-phoi-thanh-cong',
                'content' => "Giai đoạn sau chuyển phôi là khoảng thời gian 'cân não' nhất đối với các bà mẹ. Dưới đây là những dấu hiệu tích cực cho thấy phôi đang làm tổ thành công:\n\n" .
                             "1. Đau lâm râm bụng dưới: Đây là dấu hiệu phôi đang tìm vị trí bám vào niêm mạc tử cung.\n" .
                             "2. Ra máu báo: Một lượng nhỏ máu hồng nhạt có thể xuất hiện do phôi xâm nhập vào lớp lót tử cung.\n" .
                             "3. Căng tức vùng ngực: Sự thay đổi đột ngột của nội tiết tố sau thụ tinh khiến bầu ngực nhạy cảm hơn.\n" .
                             "4. Mệt mỏi, buồn ngủ: Cơ thể đang dồn năng lượng để nuôi dưỡng mầm sống mới.\n" .
                             "5. Thay đổi khẩu vị: Bạn có thể cảm thấy nhạy cảm hơn với các loại mùi vị.\n\n" .
                             "Tuy nhiên, cách chính xác nhất vẫn là thực hiện xét nghiệm Beta HCG vào ngày thứ 14 để có kết quả khẳng định.",
                'image' => 'https://cdn-together.hellohealthgroup.com/2025/03/1743437349_67eabe25be86b3.43030017',
            ],
        ];

        foreach ($posts as $item) {
            if (!Post::where('slug', $item['slug'])->exists()) {
                Post::create([
                    'title'   => $item['title'],
                    'slug'    => $item['slug'],
                    'content' => $item['content'],
                    'user_id' => $doctorId,
                    'image'   => $item['image'],
                ]);
                $this->command->info("Đã tạo: " . $item['title']);
            }
        }
    }
}
