<?php

namespace App\DTOs\Responses;

use App\Models\StorageRecord;
use Carbon\Carbon;

readonly class StorageRecordResponseDTO
{
    public function __construct(
        public int $id,
        public string $storage_type,
        public int $item_id,
        public string $start_date_formatted,
        public string $expiry_date_formatted,
        public string $status,
        public string $location_code,
        public bool $is_near_expiry
    ) {}

    public static function fromModel(StorageRecord $storage): self
    {
        $expiry = Carbon::parse($storage->expiry_date);
        
        return new self(
            id: $storage->id,
            storage_type: ucfirst($storage->storage_type),
            item_id: $storage->item_id,
            start_date_formatted: $storage->start_date->format('d/m/Y'),
            expiry_date_formatted: $expiry->format('d/m/Y'),
            status: $storage->status,
            location_code: $storage->location_code,
            // Cảnh báo nếu còn dưới 30 ngày là hết hạn
            is_near_expiry: $expiry->isFuture() && $expiry->diffInDays(now()) <= 30
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'storage_type' => $this->storage_type,
            'item_id' => $this->item_id,
            'start_date' => $this->start_date_formatted,
            'expiry_date' => $this->expiry_date_formatted,
            'status' => $this->status,
            'location_code' => $this->location_code,
            'is_near_expiry' => $this->is_near_expiry,
        ];
    }
}