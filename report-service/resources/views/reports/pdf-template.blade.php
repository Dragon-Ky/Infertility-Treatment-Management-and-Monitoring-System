<!DOCTYPE html>
<html lang="vi">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Báo Cáo Medicen</title>
    <style>
        body { font-family: 'DejaVu Sans', sans-serif; font-size: 14px; color: #334155; line-height: 1.5; }
        .header { text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #2563eb; }
        .logo-text { font-size: 28px; font-weight: bold; color: #1e3a8a; margin-bottom: 5px; }
        .sub-title { font-size: 16px; color: #64748b; text-transform: uppercase; letter-spacing: 2px; }
        .info-box { margin-bottom: 30px; background-color: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; }
        .info-box p { margin: 5px 0; }
        .section-title { font-size: 18px; font-weight: bold; color: #2563eb; margin-top: 30px; margin-bottom: 15px; border-left: 4px solid #2563eb; padding-left: 10px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #cbd5e1; padding: 12px; text-align: left; }
        th { background-color: #f1f5f9; color: #0f172a; font-weight: bold; }
        tr:nth-child(even) { background-color: #f8fafc; }
        .text-right { text-align: right; }
        .highlight { font-weight: bold; color: #059669; }
    </style>
</head>
<body>

    <div class="header">
        <div class="logo-text">HỆ THỐNG MEDICEN CLINIC</div>
        <div class="sub-title">BÁO CÁO TỔNG HỢP HOẠT ĐỘNG</div>
    </div>

    <div class="info-box">
        <p><strong>Tên báo cáo:</strong> {{ $report->name }}</p>
        <p><strong>Kỳ báo cáo:</strong> {{ $report->parameters['period'] ?? 'N/A' }}</p>
        <p><strong>Ngày xuất:</strong> {{ \Carbon\Carbon::parse($report->created_at)->format('d/m/Y H:i') }}</p>
        <p><strong>Trạng thái:</strong> Hoàn tất</p>
    </div>

    <!-- BẢNG DOANH THU -->
    <div class="section-title">1. BÁO CÁO DOANH THU</div>
    <table>
        <thead>
            <tr>
                <th>Hạng Mục Doanh Thu</th>
                <th class="text-right">Giá Trị (VNĐ)</th>
            </tr>
        </thead>
        <tbody>
            @php $revStats = $data['revenue_stats'] ?? (isset($data['Doanh thu IVF']) ? $data : []); @endphp
            @if(is_array($revStats) && count($revStats) > 0)
                @foreach($revStats as $key => $value)
                    @if(!is_array($value) && !in_array($key, ['period', 'type', 'generated_at']))
                    <tr>
                        <td>{{ str_replace('_', ' ', mb_strtoupper($key)) }}</td>
                        <td class="text-right highlight">{{ is_numeric($value) ? number_format($value, 0, ',', '.') . ' đ' : $value }}</td>
                    </tr>
                    @endif
                @endforeach
            @else
                <tr><td colspan="2">Chưa có dữ liệu doanh thu</td></tr>
            @endif
        </tbody>
    </table>

    <!-- BẢNG PHÁC ĐỒ ĐIỀU TRỊ -->
    <div class="section-title">2. THỐNG KÊ PHÁC ĐỒ (IVF/IUI)</div>
    <table>
        <thead>
            <tr>
                <th>Trạng Thái Điều Trị</th>
                <th class="text-right">Số Lượng (Ca)</th>
            </tr>
        </thead>
        <tbody>
            @php $treatStats = $data['treatment_stats'] ?? (isset($data['completed']) ? $data : []); @endphp
            @if(is_array($treatStats) && count($treatStats) > 0)
                @foreach($treatStats as $key => $value)
                    @if(!is_array($value) && !in_array($key, ['period', 'type', 'generated_at']))
                    <tr>
                        <td>{{ str_replace('_', ' ', mb_strtoupper($key)) }}</td>
                        <td class="text-right font-bold">{{ $value }}</td>
                    </tr>
                    @endif
                @endforeach
            @else
                <tr><td colspan="2">Chưa có dữ liệu phác đồ</td></tr>
            @endif
        </tbody>
    </table>

    <div style="margin-top: 50px; text-align: right; padding-right: 50px;">
        <p><strong>Người lập biểu</strong></p>
        <p style="color: #94a3b8; font-style: italic; margin-top: 50px;">(Hệ thống xuất tự động)</p>
    </div>

</body>
</html>
