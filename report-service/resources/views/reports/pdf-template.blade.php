<!DOCTYPE html>
<html lang="vi">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Báo Cáo Medicen Clinic</title>
    <style>
        /* Setup trang in PDF */
        @page {
            margin: 40px 50px;
        }

        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 13px;
            color: #334155;
            line-height: 1.6;
        }

        /* --- TYPOGRAPHY & COLORS --- */
        .text-primary {
            color: #1e3a8a;
        }

        .text-secondary {
            color: #64748b;
        }

        .text-success {
            color: #059669;
        }

        .text-right {
            text-align: right;
        }

        .text-center {
            text-align: center;
        }

        .font-bold {
            font-weight: bold;
        }

        .uppercase {
            text-transform: uppercase;
        }

        /* --- LAYOUT TABLES (Dùng Table để dàn layout chuẩn DomPDF) --- */
        .layout-table {
            width: 100%;
            border: none;
            margin-bottom: 30px;
            border-collapse: collapse;
        }

        .layout-table td {
            border: none;
            padding: 0;
            vertical-align: top;
        }

        /* --- HEADER --- */
        .logo-text {
            font-size: 26px;
            font-weight: 900;
            color: #1e3a8a;
            letter-spacing: 1px;
        }

        .clinic-info {
            font-size: 11px;
            color: #64748b;
            margin-top: 5px;
        }

        .report-title-main {
            font-size: 22px;
            font-weight: bold;
            color: #0f172a;
            margin-bottom: 5px;
            text-transform: uppercase;
        }

        /* --- BẢNG THÔNG TIN REPORT (CARD) --- */
        .info-card {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-top: 4px solid #2563eb;
            padding: 20px;
            margin-bottom: 30px;
        }

        .info-table {
            width: 100%;
        }

        .info-table td {
            padding: 5px 0;
            font-size: 13px;
        }

        .info-label {
            font-weight: bold;
            color: #475569;
            width: 120px;
        }

        /* --- SECTION TITLES --- */
        .section-title {
            font-size: 15px;
            font-weight: bold;
            color: #1e3a8a;
            margin-top: 35px;
            margin-bottom: 15px;
            padding-bottom: 5px;
            border-bottom: 2px solid #cbd5e1;
            text-transform: uppercase;
        }

        /* --- DATA TABLES --- */
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }

        .data-table th,
        .data-table td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid #e2e8f0;
        }

        .data-table th {
            background-color: #1e3a8a;
            color: #ffffff;
            font-weight: bold;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .data-table tbody tr:nth-child(even) {
            background-color: #f8fafc;
        }

        .data-table tbody tr:hover {
            background-color: #f1f5f9;
        }

        .row-total {
            background-color: #f1f5f9;
            font-weight: bold;
        }

        .row-total td {
            border-top: 2px solid #94a3b8;
            color: #0f172a;
        }

        /* --- FOOTER (Chữ ký) --- */
        .signature-section {
            margin-top: 60px;
            width: 100%;
        }

        .signature-box {
            text-align: center;
            width: 40%;
            float: right;
        }

        .signature-title {
            font-weight: bold;
            color: #0f172a;
            font-size: 14px;
        }

        .signature-date {
            font-size: 12px;
            color: #64748b;
            font-style: italic;
            margin-bottom: 70px;
        }

        /* Clearfix cho float */
        .clearfix::after {
            content: "";
            clear: both;
            display: table;
        }
    </style>
</head>

<body>

    
    <table class="layout-table">
        <tr>
            
            <td style="width: 50%;">
                <div class="logo-text">MEDICEN CLINIC</div>
                <div class="clinic-info">
                    Trung tâm Điều trị vô sinh hiếm muộn<br>
                    Tòa nhà Medical Center, Q.1, TP. HCM<br>
                    Hotline: 1900 1234 | Email: admin@medicen.com
                </div>
            </td>
           
            <td style="width: 50%; text-align: right; vertical-align: bottom;">
                <div class="report-title-main">BÁO CÁO TỔNG HỢP</div>
                <div class="text-secondary uppercase">Mã số: REP-{{ str_pad($report->id ?? 1, 5, '0', STR_PAD_LEFT) }}
                </div>
            </td>
        </tr>
    </table>

   
    <div class="info-card">
        <table class="info-table">
            <tr>
                <td class="info-label">Tên báo cáo:</td>
                <td class="font-bold text-primary">{{ $report->name ?? 'Báo cáo thống kê hoạt động' }}</td>
                <td class="info-label">Người xuất:</td>
                <td>{{ $report->user->name ?? 'Quản trị viên hệ thống' }}</td>
            </tr>
            <tr>
                <td class="info-label">Kỳ báo cáo:</td>
                <td><span
                        style="background: #e0f2fe; color: #0284c7; padding: 3px 8px; border-radius: 4px; font-weight: bold;">{{ $report->parameters['period'] ?? date('Y-m') }}</span>
                </td>
                <td class="info-label">Ngày trích xuất:</td>
                <td>{{ \Carbon\Carbon::parse($report->created_at ?? now())->format('d/m/Y H:i') }}</td>
            </tr>
        </table>
    </div>

    
    <div class="section-title">1. Cơ cấu Doanh thu Dịch vụ</div>
    <table class="data-table">
        <thead>
            <tr>
                <th style="width: 5%;">STT</th>
                <th style="width: 55%;">Hạng Mục Dịch Vụ</th>
                <th class="text-right" style="width: 40%;">Giá Trị Chuyển Đổi (VNĐ)</th>
            </tr>
        </thead>
        <tbody>
            @php
                $revStats = $data['revenue_stats'] ?? (isset($data['Doanh thu IVF']) ? $data : []);
                $totalRevenue = 0;
                $stt = 1;
            @endphp

            @if(is_array($revStats) && count($revStats) > 0)
                @foreach($revStats as $key => $value)
                    @if(!is_array($value) && !in_array($key, ['period', 'type', 'generated_at']))
                        @php $totalRevenue += is_numeric($value) ? $value : 0; @endphp
                        <tr>
                            <td class="text-center text-secondary">{{ $stt++ }}</td>
                            <td class="font-bold text-primary">{{ str_replace('_', ' ', mb_strtoupper($key)) }}</td>
                            <td class="text-right font-bold text-success">
                                {{ is_numeric($value) ? number_format($value, 0, ',', '.') . ' ₫' : $value }}</td>
                        </tr>
                    @endif
                @endforeach
                <!-- Dòng tính tổng -->
                <tr class="row-total">
                    <td colspan="2" class="text-right uppercase">Tổng Doanh Thu Trong Kỳ:</td>
                    <td class="text-right text-success" style="font-size: 15px;">
                        {{ number_format($totalRevenue, 0, ',', '.') }} ₫</td>
                </tr>
            @else
                <tr>
                    <td colspan="3" class="text-center text-secondary py-4">Hệ thống chưa ghi nhận dữ liệu doanh thu trong
                        kỳ này.</td>
                </tr>
            @endif
        </tbody>
    </table>

   
    <div class="section-title">2. Thống kê Phác đồ Điều trị (IVF/IUI)</div>
    <table class="data-table">
        <thead>
            <tr>
                <th style="width: 5%;">STT</th>
                <th style="width: 65%;">Trạng Thái Bệnh Án</th>
                <th class="text-right" style="width: 30%;">Số Lượng Ghi Nhận</th>
            </tr>
        </thead>
        <tbody>
            @php 
                                $treatStats = $data['treatment_stats'] ?? (isset($data['completed']) ? $data : []);
                $totalCases = 0;
                $stt2 = 1;

                // Map tên trạng thái tiếng Anh sang tiếng Việt cho đẹp
                $statusMap = [
                    'completed' => 'Đã hoàn thành',
                    'in_progress' => 'Đang điều trị',
                    'pending' => 'Chờ xử lý',
                    'cancelled' => 'Đã hủy'
                ];
            @endphp
        @if(is_array($treatStats) && count($treatStats) > 0)
            @foreach($treatStats as $key => $value)
                @if(!is_array($value) && !in_array($key, ['period', 'type', 'generated_at']))
                                    @php 
                                                    $totalCases += is_numeric($value) ? $value : 0;
                                        $displayKey = $statusMap[$key] ?? str_replace('_', ' ', mb_strtoupper($key));
                                    @endphp
                                        <tr>
                    <td class="text-center text-secondary">{{ $stt2++ }}</td>
                                            <td class="font-bold text-primary">{{ $displayKey }}</td>
                                            <td class="text-right font-bold">{{ number_format($value, 0, ',', '.') }} ca</td>
                                        </tr>
                @endif
            @endforeach

                            
                <tr class="row-total">
                    <td colspan="2" class="text-right uppercase">Tổng Số Ca Xử Lý:</td>
                    <td class="text-right text-primary" style="font-size: 14px;">{{ number_format($totalCases, 0, ',', '.') }} ca</td>
                </tr>
        @else

                 <tr><td colspan="3" class="text-center text-secondary py-4">Chưa có dữ liệu phác đồ được ghi nhận.</td></tr>
            @endif
        </tbody>
    </table>

    
    <div class="signature-section clearfix">
        <div class="signature-box">
            <div class="signature-date">TP. Hồ Chí Minh, ngày {{ date('d') }} tháng {{ date('m') }} năm {{ date('Y') }}</div>
            <div class="signature-title uppercase">Giám đốc Điều hành</div>
            <div style="margin-top: 80px; font-weight: bold; color: #1e3a8a;">BS. Trưởng Khoa</div>
            <div style="font-size: 11px; color: #64748b; margin-top: 5px;">(Đã ký và đóng dấu bằng điện tử)</div>
        </div>
    </div>

</body>
</html>