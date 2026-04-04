<?php

namespace App\DTOs\Requests;

readonly class CreateStorageRecordRequestDTO
{
    public function __construct(
        public int $treatment_id,
        public string $storage_type,
        public int $item_id,
        public string $start_date,
        public string $expiry_date,
        public string $location_code,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            treatment_id: $data['treatment_id'],
            storage_type: $data['storage_type'],
            item_id:      $data['item_id'],
            start_date:   $data['start_date'],
            expiry_date:  $data['expiry_date'],
            location_code: $data['location_code'],
        );
    }
}