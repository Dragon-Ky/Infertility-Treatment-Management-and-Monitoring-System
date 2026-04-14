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
    // Tìm bản ghi theo các thuộc tính
    public function findByAttributes(array $attributes)
    {
        return $this->model->where($attributes)->get();
    }

     public function search(array $searchParams = [], array $conditions = [])
    {
        $query = $this->model->newQuery();

        if (!empty($conditions)) {
            $query->where($conditions);
        }

        // Xử lý tìm kiếm keyword
        if (!empty($searchParams['keyword'])) {
            $keyword = $searchParams['keyword'];
            
            $query->where(function ($q) use ($keyword) {
                if (property_exists($this->model, 'searchable') && is_array($this->model->searchable)) {
                    foreach ($this->model->searchable as $index => $field) {
                        if ($index === 0) {
                            $q->where($field, 'LIKE', "%{$keyword}%");
                        } else {
                            $q->orWhere($field, 'LIKE', "%{$keyword}%");
                        }
                    }
                } else {
                    $fillable = $this->model->getFillable();
                    $first = true;
                    foreach ($fillable as $field) {
                        if (in_array($field, ['id', 'is_active']) || str_ends_with($field, '_id') || str_ends_with($field, '_at') || str_ends_with($field, '_date')) {
                            continue;
                        }
                        
                        if ($first) {
                            $q->where($field, 'LIKE', "%{$keyword}%");
                            $first = false;
                        } else {
                            $q->orWhere($field, 'LIKE', "%{$keyword}%");
                        }
                    }
                }
            });
        }

        // Lọc theo các trường cố định
        foreach ($searchParams as $key => $value) {
            if (!in_array($key, ['keyword', 'page', 'per_page'])) {
                if (in_array($key, $this->model->getFillable()) || $key === 'id') {
                    $query->where($key, $value);
                }
            }
        }

        if (isset($searchParams['per_page'])) {
            return $query->paginate((int) $searchParams['per_page']);
        }

        return $query->get();
    }
}