<?php

namespace App\Services;

use PhpAmqpLib\Connection\AMQPStreamConnection;
use PhpAmqpLib\Message\AMQPMessage;

class RabbitMQService
{
    protected $connection;
    protected $channel;

    public function __construct()
    {
        $this->connection = new AMQPStreamConnection(
            env('RABBITMQ_HOST', 'localhost'),
            env('RABBITMQ_PORT', 5672),
            env('RABBITMQ_USER', 'guest'),
            env('RABBITMQ_PASS', 'guest')
        );
        $this->channel = $this->connection->channel();
    }

    public function publish($routingKey, $data)
    {
        $this->channel->queue_declare($routingKey, false, true, false, false);

        $msg = new AMQPMessage(
            json_encode($data),
            ['delivery_mode' => AMQPMessage::DELIVERY_MODE_PERSISTENT]
        );

        $this->channel->basic_publish($msg, '', $routingKey);

        return true;
    }

    public function close()
    {
        $this->channel->close();
        $this->connection->close();
    }

    public function __destruct()
    {
        $this->close();
    }
}
