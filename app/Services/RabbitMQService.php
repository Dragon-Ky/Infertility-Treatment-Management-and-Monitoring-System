<?php
namespace App\Services;
use PhpAmqpLib\Connection\AMQPStreamConnection;
use PhpAmqpLib\Message\AMQPMessage;

class RabbitMQService {
    public function publish($event, $data) {
        $connection = new AMQPStreamConnection(env('RABBITMQ_HOST'), env('RABBITMQ_PORT'), env('RABBITMQ_USER'), env('RABBITMQ_PASS'));
        $channel = $connection->channel();
        $channel->queue_declare('notification_queue', false, true, false, false);
        $msg = new AMQPMessage(json_encode(['event' => $event, 'data' => $data]));
        $channel->basic_publish($msg, '', 'notification_queue');
        $channel->close(); $connection->close();
    }
}