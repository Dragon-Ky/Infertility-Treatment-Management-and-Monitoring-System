<?php

namespace App\DTOs\Requests;

readonly class CreateStorageRecordRequestDTO
{
    public function __construct(
        public int $patient_id,
        public string $sample_type,
        public string $tank_location,
        public string $freeze_date,
        public string $expiration_date,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            patient_id: $data['patient_id'],
            sample_type: $data['sample_type'],
            tank_location: $data['tank_location'],
            freeze_date: $data['freeze_date'],
            expiration_date: $data['expiration_date'],
        );
    }
}