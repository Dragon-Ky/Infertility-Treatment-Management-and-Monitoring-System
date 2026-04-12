<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MarkAsReadRequest extends FormRequest
{
    /**
     * Quyết định xem user có quyền gọi API này không.
     * (Tạm thời return true, sau này có Token Auth thì tính sau)
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Mẹo của Senior: Bắt cái ID trên đường dẫn URL (route) chèn vào data để kiểm tra luôn.
     */
    protected function prepareForValidation()
    {
        $this->merge([
            'id' => $this->route('id'),
        ]);
    }

    /**
     * Luật kiểm tra: Bắt buộc phải có ID, phải là số, và phải tồn tại trong bảng notifications.
     */
    public function rules(): array
    {
        return [
            'id' => 'required|integer|exists:notifications,id',
        ];
    }

    /**
     * Dịch lỗi sang tiếng Việt cho App Mobile dễ hiển thị.
     */
    public function messages(): array
    {
        return [
            'id.exists' => 'Thông báo này không tồn tại hoặc đã bị xóa!',
            'id.integer' => 'ID thông báo không hợp lệ!'
        ];
    }
}