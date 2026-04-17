<?php

namespace App\DTOs\Responses;

use App\Models\LabResult;

readonly class LabResultResponseDTO
{
    public function __construct(
        public int $id,
        public int $treatment_id,
        public ?string $protocol_name,
        public string $test_type,
        public string $test_date,
        public string $test_date_formatted,
        public array $result_data,
        public ?string $reference_range,
        public ?string $unit,
        public ?string $doctor_notes,
        public bool $is_active,
    ) {
    }

    public static function fromModel(LabResult $lab): self
    {
        return new self(
            id: $lab->id,
            treatment_id: (int) $lab->treatment_id,
            protocol_name: $lab->treatmentProtocol->protocol_name ?? 'ID: ' . $lab->treatment_id,
            test_type: $lab->test_type,
            test_date: $lab->test_date->format('Y-m-d'),
            test_date_formatted: $lab->test_date->format('d/m/Y H:i'),
            result_data: $lab->result_data,
            reference_range: $lab->reference_range,
            unit: $lab->unit,
            doctor_notes: $lab->doctor_notes,
            is_active: (bool) $lab->is_active,
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'treatment_id' => $this->treatment_id,
            'protocol_name' => $this->protocol_name,
            'test_type' => $this->test_type,
            'test_date' => $this->test_date,
            'test_date_formatted' => $this->test_date_formatted,
            'result_data' => $this->result_data,
            'reference_range' => $this->reference_range,
            'unit' => $this->unit,
            'doctor_notes' => $this->doctor_notes,
            'is_active' => $this->is_active,
        ];
    }
}