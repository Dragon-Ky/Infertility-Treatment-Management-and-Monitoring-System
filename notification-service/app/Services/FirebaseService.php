<?php

namespace App\Services;

use Kreait\Firebase\Factory;
use Kreait\Firebase\Messaging\CloudMessage;

class FirebaseService
{
    protected $messaging;

    public function __construct()
    {
        $credentialsPath = config('firebase.credentials');
        
        if (file_exists($credentialsPath)) {
            $factory = (new Factory)
                ->withServiceAccount($credentialsPath);
            $this->messaging = $factory->createMessaging();
        } else {
            \Log::warning("Firebase credentials file not found at: {$credentialsPath}. Push notifications will be disabled.");
            $this->messaging = null;
        }
    }

    public function sendToDevice(string $token, array $message): array
    {
        $cloudMessage = CloudMessage::withTarget('token', $token)
            ->withNotification([
                'title' => $message['title'],
                'body'  => $message['body']
            ])
            ->withData($message['data'] ?? []);

        if (!$this->messaging) {
            return ['status' => 'failed', 'error' => 'Firebase not initialized'];
        }

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

        if (!$this->messaging) {
            return ['status' => 'failed', 'error' => 'Firebase not initialized'];
        }

        return $this->messaging->sendEachForMulticast($cloudMessage, $tokens);
    }
}