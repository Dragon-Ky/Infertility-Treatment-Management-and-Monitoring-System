<?php

namespace App\Services;

use Kreait\Firebase\Factory;
use Kreait\Firebase\Messaging\CloudMessage;

class FirebaseService
{
    protected $messaging;

    public function __construct()
    {
        $factory = (new Factory)
            ->withServiceAccount(config('firebase.credentials'));
        
        $this->messaging = $factory->createMessaging();
    }

    public function sendToDevice(string $token, array $message): array
    {
        $cloudMessage = CloudMessage::withTarget('token', $token)
            ->withNotification([
                'title' => $message['title'],
                'body'  => $message['body']
            ])
            ->withData($message['data'] ?? []);

        return $this->messaging->send($cloudMessage);
    }

    public function sendToMultipleDevices(array $tokens, array $message): array
    {
        $cloudMessage = CloudMessage::new()
            ->withNotification([
                'title' => $message['title'],
                'body'  => $message['body']
            ])
            ->withData($message['data'] ?? []);

        return $this->messaging->sendMulticast($cloudMessage, $tokens);
    }
}