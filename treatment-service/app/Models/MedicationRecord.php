<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MedicationRecord extends Model
{
    use HasFactory;

    // Tên bảng thực tế trong Database
    protected $table = 'medication_records';

    // Các cột cho phép lưu dữ liệu hàng loạt (Mass Assignment)
    protected $fillable = [
        'medication_schedule_id', // ID liên kết với lịch trình thuốc
        'scheduled_time',         // Thời gian dự kiến uống
        'actual_time',            // Thời gian thực tế đã uống
        'status',                 // Trạng thái (taken, missed, skipped)
        'notes',                  // Ghi chú/Phản ứng phụ
        'recorded_by',            // ID người thực hiện ghi nhận
        'is_active'
    ];

    /**
     * Tự động chuyển đổi kiểu dữ liệu khi lấy từ DB ra
     */
    protected $casts = [
        'is_active'      => 'boolean',
        'scheduled_time' => 'datetime',
        'actual_time'    => 'datetime',
        'created_at'     => 'datetime',
        'updated_at'     => 'datetime',
    ];
    public function medicationRecords()
    {
        // "Tôi có nhiều bản ghi uống thuốc"
        return $this->hasMany(MedicationRecord::class, 'medication_schedule_id', 'id');
    }
}