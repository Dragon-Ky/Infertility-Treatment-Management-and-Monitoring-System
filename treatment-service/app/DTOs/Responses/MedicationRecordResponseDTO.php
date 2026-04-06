<?php

namespace App\DTOs\Responses;

use App\Models\MedicationRecord;
use Carbon\Carbon;

readonly class MedicationRecordResponseDTO
{
    public function __construct(
        public int $id,
        public int $medication_schedule_id,
        public string $scheduled_time_formatted,
        public string $actual_time_formatted,
        public string $status,
        public int $recorded_by,
        public ?string $notes,
        public bool $is_active,
    ) {}

    public static function fromModel(MedicationRecord $record): self
    {
        return new self(
            id: $record->id,
            medication_schedule_id: $record->medication_schedule_id,
            scheduled_time_formatted: Carbon::parse($record->scheduled_time)->format('d/m/Y H:i'),
            actual_time_formatted: Carbon::parse($record->actual_time)->format('d/m/Y H:i'),
            status: $record->status,
            recorded_by: $record->recorded_by,
            notes: $record->notes,
            is_active: $record->is_active,
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'medication_schedule_id' => $this->medication_schedule_id,
            'scheduled_time' => $this->scheduled_time_formatted,
            'actual_time' => $this->actual_time_formatted,
            'status' => $this->status,
            'recorded_by' => $this->recorded_by,
            'notes' => $this->notes,
            'is_active' => $this->is_active,
        ];
    }
}