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
        try {
            $this->connection = new AMQPStreamConnection(
                env('RABBITMQ_HOST', 'localhost'),
                env('RABBITMQ_PORT', 5672),
                env('RABBITMQ_USER', 'guest'),
                env('RABBITMQ_PASSWORD', 'guest')
            );
            $this->channel = $this->connection->channel();
        } catch (\Exception $e) {
            \Log::error("RabbitMQ Connection Error: " . $e->getMessage());
            $this->connection = null;
            $this->channel = null;
        }
    }

    public function publish($routingKey, $data)
    {
        if (!$this->channel) {
            \Log::warning("RabbitMQ channel not available for publishing.");
            return false;
        }

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
        if ($this->channel) {
            $this->channel->close();
        }
        if ($this->connection) {
            $this->connection->close();
        }
    }

    public function __destruct()
    {
        if ($this->channel || $this->connection) {
            $this->close();
        }
    }
}
