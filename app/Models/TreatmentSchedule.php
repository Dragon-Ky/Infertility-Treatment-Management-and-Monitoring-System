<?php 

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class TreatmentSchedule extends Model {
    protected $fillable = ['treatment_id', 'schedule_date', 'schedule_type', 'description', 'status', 'reminder_sent'];
}