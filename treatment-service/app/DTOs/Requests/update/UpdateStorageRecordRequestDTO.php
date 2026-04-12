<?php
namespace App\DTOs\Requests\Update;

readonly class UpdateStorageRecordRequestDTO
{
    public function __construct(
        public ?string $expiry_date = null,
        public ?string $status = null, // active|expired|released
        public ?string $location_code = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            expiry_date: $data['expiry_date'] ?? null,
            status: $data['status'] ?? null,
            location_code: $data['location_code'] ?? null,
        );
    }
}