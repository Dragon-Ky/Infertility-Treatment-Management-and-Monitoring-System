<?php

namespace App\DTOs\Requests;

use Illuminate\Http\Request;

readonly class SearchTreatmentRequestDTO
{
    /**
     * @param string|null $keyword Từ khóa tìm kiếm (mã phôi, tên thuốc, ghi chú...)
     * @param int|null $treatment_id Lọc theo đợt điều trị
     * @param array $filters Các bộ lọc động khác (status, test_type, v.v.)
     */
    public function __construct(
        public ?string $keyword = null,
        public ?int $treatment_id = null,
        public array $filters = []
    ) {}

    /**
     * Tạo DTO từ Request hiện tại
     */
    public static function fromRequest(Request $request): self
    {
        return new self(
            keyword: $request->query('keyword'),
            treatment_id: $request->query('treatment_id') ? (int) $request->query('treatment_id') : null,
            // Lấy tất cả ngoại trừ từ khóa và các tham số phân trang
            filters: $request->except(['keyword', 'treatment_id', 'page', 'per_page'])
        );
    }

    /**
     * Chuyển đổi thành mảng để truyền vào BaseRepository->search()
     */
    public function toArray(): array
    {
        return array_filter(array_merge(
            ['keyword' => $this->keyword],
            ['treatment_id' => $this->treatment_id],
            $this->filters
        ), fn($value) => !is_null($value));
    }
}