<?php
namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Redis;
use App\Services\NotificationService;

class ListenForNotifications extends Command
{
    // Tên lệnh để chúng ta gõ trong Terminal
    protected $signature = 'redis:listen-notifications';
    
    // Mô tả công việc của lính gác
    protected $description = 'Luôn túc trực lắng nghe sự kiện từ Redis và gửi thông báo';

    // Xử lý logic nhặt thư
    public function handle(NotificationService $notificationService)
    {
        ini_set('default_socket_timeout', -1);
        $this->info('📡 Đang túc trực bên cạnh hộp thư Redis [kênh: notification_channel]...');

        // Đăng ký kênh 'notification_channel' và ngồi chờ
        Redis::subscribe(['notification_channel'], function ($message) use ($notificationService) {
            $this->info(" co thong bao moi: " . $message);
            
            // Dữ liệu service khác ném sang thường là chuỗi JSON
            // Ví dụ: {"userId": 1, "templateKey": "REPORT_READY", "data": {"[report_name]": "Xét nghiệm máu"}}
            $payload = json_decode($message, true);

            // Kiểm tra xem thư có ghi đủ thông tin người nhận không
            if (isset($payload['userId']) && isset($payload['templateKey'])) {
                
                // Gọi bộ não NotificationService để đem thư đi giao
                $success = $notificationService->sendPushNotification(
                    $payload['userId'],
                    $payload['templateKey'],
                    $payload['data'] ?? []
                );

                if ($success) {
                    $this->info(" da chuyen giao thu cho user ID: " . $payload['userId']);
                } else {
                    $this->error(" that bai trong viec giao thu.");
                }
            } else {
                $this->error(" thu bi mat hoac thieu thong tin!");
            }
        });
    }
}