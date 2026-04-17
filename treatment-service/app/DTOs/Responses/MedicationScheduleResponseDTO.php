<?php

namespace App\DTOs\Responses;

use App\Models\MedicationSchedule;

readonly class MedicationScheduleResponseDTO
{
    public function __construct(
        public int $id,
        public int $treatment_id,
        public ?string $protocol_name,
        public string $medication_name,
        public string $dosage,
        public string $frequency,
        public string $start_date,
        public string $end_date,
        public array $time_slots,
        public string $route,
        public string $status,
        public bool $is_active,
    ) {
    }

    public static function fromModel(MedicationSchedule $schedule): self
    {
        return new self(
            id: $schedule->id,
            treatment_id: (int) $schedule->treatment_id,
            protocol_name: $schedule->treatmentProtocol->protocol_name ?? 'ID: ' . $schedule->treatment_id,
            medication_name: $schedule->medication_name,
            dosage: $schedule->dosage,
            frequency: $schedule->frequency,
            start_date: $schedule->start_date->format('Y-m-d'),
            end_date: $schedule->end_date->format('Y-m-d'),
            time_slots: $schedule->time_slots,
            route: $schedule->route,
            status: $schedule->status,
            is_active: (bool) $schedule->is_active,
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'treatment_id' => $this->treatment_id,
            'protocol_name' => $this->protocol_name,
            'medication_name' => $this->medication_name,
            'dosage' => $this->dosage,
            'frequency' => $this->frequency,
            'start_date' => $this->start_date,
            'end_date' => $this->end_date,
            'time_slots' => $this->time_slots,
            'route' => $this->route,
            'status' => $this->status,
            'is_active' => $this->is_active,
        ];
    }
}