<?php

namespace App\Repositories\Eloquent;

use App\Repositories\Contracts\BaseRepositoryInterface;
use Illuminate\Database\Eloquent\Model;

abstract class BaseRepository implements BaseRepositoryInterface
{
    protected $model;

    // Constructor tự động inject (tiêm) Model vào khi class được khởi tạo
    public function __construct(Model $model)
    {
        $this->model = $model;
    }

    // Trả về toàn bộ dữ liệu của bảng
    public function all()
    {
        return $this->model->all();
    }

    // Dùng hàm findOrFail để ném ra lỗi 404 nếu không tìm thấy ID
    public function find($id)
    {
        return $this->model->findOrFail($id);
    }

    // Nhận mảng dữ liệu và tạo bản ghi mới
    public function create(array $attributes)
    {
        return $this->model->create($attributes);
    }

    // Tìm bản ghi trước, nếu có thì update dữ liệu mới và trả về true/false
    public function update($id, array $attributes)
    {
        $record = $this->model->findOrFail($id);
        return $record->update($attributes);
    }

    // Tìm bản ghi và thực hiện xóa mềm/cứng tùy cấu hình Model
    public function delete($id)
    {
        $record = $this->model->findOrFail($id);
        return $record->delete();
    }
}