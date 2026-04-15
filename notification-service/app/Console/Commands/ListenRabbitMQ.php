<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use PhpAmqpLib\Connection\AMQPStreamConnection;
use App\Services\NotificationService;

class ListenRabbitMQ extends Command
{
    protected $signature = 'rabbitmq:listen';
    protected $description = 'Lắng nghe sự kiện từ RabbitMQ và gửi thông báo';

    public function handle(NotificationService $service)
    {
        try {
            // 1. Cấu hình kết nối SIÊU CỨNG: Thêm Keepalive và Heartbeat (nhịp tim 30s)
            $connection = new AMQPStreamConnection(
                env('RABBITMQ_HOST', '127.0.0.1'),
                env('RABBITMQ_PORT', 5672),
                env('RABBITMQ_USER', 'guest'),
                env('RABBITMQ_PASSWORD', 'guest'),
                '/', false, 'AMQPLAIN', null, 'en_US', 
                60.0, // connection_timeout (Giây)
                60.0, // read_write_timeout (Giây)
                null, 
                false, // keepalive (Chống đứt cáp)
                30    // heartbeat (Giữ kết nối luôn sống)
            );
            
            $channel = $connection->channel();
            $channel->queue_declare('notification_queue', false, true, false, false);

            $this->info("📡 Lính gác RabbitMQ (Bản Bất Tử) đang túc trực... [Queue: notification_queue]");

            $callback = function ($msg) use ($service) {
                $this->info("📩 Nhận được tin nhắn: " . $msg->body);
                $data = json_decode($msg->body, true);
                
                if (isset($data['userId'], $data['templateName'])) {
                    $result = $service->sendStoredNotification(
                        $data['userId'], 
                        $data['templateName'], 
                        $data['variables'] ?? []
                    );
                    $this->comment(" Kết quả xử lý: " . json_encode($result));
                } else {
                    $this->error(" Dữ liệu không đúng định dạng!");
                }
            };

            $channel->basic_consume('notification_queue', '', false, true, false, false, $callback);

            // 2. Vòng lặp chờ có bẫy lỗi 2 lớp
            while (count($channel->callbacks)) {
                try {
                    // Check hộp thư 10 giây 1 lần
                    $channel->wait(null, false, 10);
                } catch (\PhpAmqpLib\Exception\AMQPTimeoutException $e) {
                    // Hết 10 giây không có thư -> Im lặng quay lại chờ tiếp
                    continue; 
                } catch (\Exception $e) {
                    // Nếu RabbitMQ giở chứng đá văng mạng -> Im lặng nuốt lỗi và duy trì ca gác
                    continue; 
                }
            }

            $channel->close();
            $connection->close();

        } catch (\Exception $e) {
            $this->error("Lỗi hệ thống: " . $e->getMessage());
        }
    }
}