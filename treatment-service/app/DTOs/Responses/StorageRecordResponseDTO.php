<?php

namespace App\DTOs\Responses;

use App\Models\StorageRecord;
use Carbon\Carbon;

readonly class StorageRecordResponseDTO
{
    public function __construct(
        public int $id,
        public string $sample_type,
        public string $tank_location,
        public string $freeze_date_formatted,
        public string $expiration_date_formatted,
        public bool $is_expired // Trả thêm cờ báo hiệu sắp hết hạn
    ) {}

    public static function fromModel(StorageRecord $storage): self
    {
        $expiration = Carbon::parse($storage->expiration_date);
        
        return new self(
            id: $storage->id,
            sample_type: ucfirst($storage->sample_type),
            tank_location: $storage->tank_location,
            freeze_date_formatted: Carbon::parse($storage->freeze_date)->format('d/m/Y'),
            expiration_date_formatted: $expiration->format('d/m/Y'),
            is_expired: $expiration->isPast() // Kiểm tra xem ngày hết hạn đã qua chưa
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'sample_type' => $this->sample_type,
            'tank_location' => $this->tank_location,
            'freeze_date' => $this->freeze_date_formatted,
            'expiration_date' => $this->expiration_date_formatted,
            'is_expired' => $this->is_expired,
        ];
    }
}