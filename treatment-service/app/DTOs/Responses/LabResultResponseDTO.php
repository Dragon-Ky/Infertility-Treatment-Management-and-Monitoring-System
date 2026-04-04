<?php

namespace App\DTOs\Responses;

use App\Models\LabResult;

readonly class LabResultResponseDTO
{
    public function __construct(
        public int $id,
        public string $test_type,
        public string $test_date_formatted,
        public array $result_data,
        public ?string $unit,
        public ?string $doctor_notes,
        public array $attachments
    ) {}

    public static function fromModel(LabResult $lab): self
    {
        return new self(
            id: $lab->id,
            test_type: $lab->test_type,
            test_date_formatted: $lab->test_date->format('d/m/Y H:i'),
            result_data: $lab->result_data,
            unit: $lab->unit,
            doctor_notes: $lab->doctor_notes,
            attachments: $lab->attachments ?? []
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'test_type' => $this->test_type,
            'test_date' => $this->test_date_formatted,
            'result_data' => $this->result_data,
            'unit' => $this->unit,
            'doctor_notes' => $this->doctor_notes,
            'attachments' => $this->attachments,
        ];
    }
}