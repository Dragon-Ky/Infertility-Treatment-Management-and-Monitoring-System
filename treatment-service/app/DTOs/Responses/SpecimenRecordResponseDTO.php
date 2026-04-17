<?php

namespace App\DTOs\Responses;

use App\Models\SpecimenRecord;

class SpecimenRecordResponseDTO
{
    public function __construct(
        public int $id,
        public int $treatment_id,
        public ?string $protocol_name,
        public string $type,
        public string $specimen_code,
        public ?string $fertilization_date,
        public ?int $development_day,
        public ?string $grade,
        public string $status,
        public ?string $notes,
        public bool $is_active,
    ) {
    }

    public static function fromModel(SpecimenRecord $specimen): self
    {
        return new self(
            id: $specimen->id,
            treatment_id: $specimen->treatment_id,
            protocol_name: $specimen->treatmentProtocol->protocol_name ?? 'ID: ' . $specimen->treatment_id,
            type: $specimen->type,
            specimen_code: $specimen->specimen_code,
            fertilization_date: $specimen->fertilization_date ? $specimen->fertilization_date->format('Y-m-d') : null,
            development_day: $specimen->development_day,
            grade: $specimen->grade,
            status: $specimen->status,
            notes: $specimen->notes,
            is_active: (bool) $specimen->is_active,
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'treatment_id' => $this->treatment_id,
            'protocol_name' => $this->protocol_name,
            'type' => $this->type,
            'specimen_code' => $this->specimen_code,
            'fertilization_date' => $this->fertilization_date,
            'development_day' => $this->development_day,
            'grade' => $this->grade,
            'status' => $this->status,
            'notes' => $this->notes,
            'is_active' => $this->is_active,
        ];
    }
}
