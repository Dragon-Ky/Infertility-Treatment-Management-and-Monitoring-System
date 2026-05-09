<!DOCTYPE html>
<html>
<head>
    <title>Thông báo lịch khám</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; }
        .header { background-color: #3b82f6; color: white; padding: 20px; text-align: center; border-radius: 12px 12px 0 0; }
        .content { padding: 20px; }
        .footer { text-align: center; font-size: 12px; color: #64748b; margin-top: 20px; }
        .details { background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .btn { display: inline-block; padding: 10px 20px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Nhắc Nhở Lịch Khám</h1>
        </div>
        <div class="content">
            <p>Xin chào <strong>{{ $userName }}</strong>,</p>
            <p>Đây là thông báo nhắc nhở về lịch khám sắp tới của bạn tại hệ thống Quản lý Hiếm muộn.</p>
            
            <div class="details">
                <p><strong>Loại khám:</strong> {{ $appointmentType }}</p>
                <p><strong>Ngày khám:</strong> {{ $appointmentDate }}</p>
                <p><strong>Giờ khám:</strong> {{ $appointmentTime }}</p>
                <p><strong>Bác sĩ phụ trách:</strong> {{ $doctorName }}</p>
                @if($notes)
                    <p><strong>Ghi chú:</strong> {{ $notes }}</p>
                @endif
            </div>

            <p>Vui lòng đến đúng giờ để được phục vụ tốt nhất. Nếu bạn có bất kỳ thay đổi nào, vui lòng liên hệ với chúng tôi sớm nhất có thể.</p>
            
            <div style="text-align: center; margin-top: 30px;">
                <a href="{{ env('FRONTEND_URL', 'http://localhost:5173') }}" class="btn">Xem chi tiết trên hệ thống</a>
            </div>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} Infertility Management System. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
