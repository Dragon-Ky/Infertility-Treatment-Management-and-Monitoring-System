<?php

namespace App\DTOs\Responses;

use App\Models\MedicationRecord;
use Carbon\Carbon;

readonly class MedicationRecordResponseDTO
{
    public function __construct(
        public int $id,
        public int $schedule_id,
        public string $administered_at_formatted,
        public int $staff_id,
        public ?string $notes
    ) {}

    public static function fromModel(MedicationRecord $record): self
    {
        return new self(
            id: $record->id,
            schedule_id: $record->schedule_id,
            administered_at_formatted: Carbon::parse($record->administered_at)->format('d/m/Y H:i'),
            staff_id: $record->staff_id,
            notes: $record->notes
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'schedule_id' => $this->schedule_id,
            'administered_time' => $this->administered_at_formatted,
            'staff_id' => $this->staff_id,
            'notes' => $this->notes,
        ];
    }
}