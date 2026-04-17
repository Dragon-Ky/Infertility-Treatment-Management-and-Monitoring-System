<?php

namespace App\DTOs\Responses;

use App\Models\StorageRecord;
use Carbon\Carbon;

readonly class StorageRecordResponseDTO
{
    public function __construct(
        public int $id,
        public int $treatment_id,
        public ?string $protocol_name,
        public string $storage_type,
        public int $item_id,
        public string $start_date,
        public string $expiry_date,
        public string $start_date_formatted,
        public string $expiry_date_formatted,
        public string $status,
        public string $location_code,
        public bool $is_near_expiry,
        public bool $is_active,
    ) {
    }

    public static function fromModel(StorageRecord $storage): self
    {
        $expiry = Carbon::parse($storage->expiry_date);

        return new self(
            id: $storage->id,
            treatment_id: (int) $storage->treatment_id,
            protocol_name: $storage->treatmentProtocol->protocol_name ?? 'ID: ' . $storage->treatment_id,
            storage_type: ucfirst($storage->storage_type),
            item_id: $storage->item_id,
            start_date: $storage->start_date->format('Y-m-d'),
            expiry_date: $storage->expiry_date->format('Y-m-d'),
            start_date_formatted: $storage->start_date->format('d/m/Y'),
            expiry_date_formatted: $expiry->format('d/m/Y'),
            status: $storage->status,
            location_code: $storage->location_code,
            // Cảnh báo nếu còn dưới 30 ngày là hết hạn
            is_near_expiry: $expiry->isFuture() && $expiry->diffInDays(now()) <= 30,
            is_active: (bool) $storage->is_active,
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'treatment_id' => $this->treatment_id,
            'protocol_name' => $this->protocol_name,
            'storage_type' => $this->storage_type,
            'item_id' => $this->item_id,
            'start_date' => $this->start_date,
            'expiry_date' => $this->expiry_date,
            'start_date_formatted' => $this->start_date_formatted,
            'expiry_date_formatted' => $this->expiry_date_formatted,
            'status' => $this->status,
            'location_code' => $this->location_code,
            'is_near_expiry' => $this->is_near_expiry,
            'is_active' => $this->is_active,
        ];
    }
}