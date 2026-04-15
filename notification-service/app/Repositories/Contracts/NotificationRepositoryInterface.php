<?php
namespace App\Repositories\Contracts;

interface NotificationRepositoryInterface
{
    public function getTemplate(string $key);
    public function userWantsNotification(int $userId): bool;
    public function logNotification(int $userId, string $messageBody, string $status): void;
}