<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LabResult extends Model
{
    use HasFactory;

    // Tên bảng trong Database
    protected $table = 'lab_results';

    // Các trường được phép lưu dữ liệu hàng loạt
    protected $fillable = [
        'treatment_id',
        'test_type',
        'test_date',
        'result_data',
        'reference_range',
        'unit',
        'doctor_notes',
        'is_active',
    ];

    /**
     * Chuyển đổi kiểu dữ liệu tự động
     */
    protected $casts = [
        'is_active'   => 'boolean',
        'test_date'   => 'datetime', // Chuyển chuỗi ngày tháng thành đối tượng Carbon
        'result_data' => 'array',    // Tự động giải mã JSON thành Mảng khi đọc và ngược lại
        'attachments' => 'array',    // Tự động xử lý danh sách file đính kèm dạng Mảng
        'created_at'  => 'datetime',
        'updated_at'  => 'datetime',
    ];

    public function treatmentProtocol()
    {
        return $this->belongsTo(TreatmentProtocol::class, 'treatment_id', 'id');
    }
}