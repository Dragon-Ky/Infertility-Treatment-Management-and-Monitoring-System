<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Hệ thống Đặt lịch Khám - UTC</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <style>
        body { background-color: #f0f4f8; font-family: 'Segoe UI', sans-serif; }
        .booking-card { border: none; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); overflow: hidden; }
        .header-section { background: linear-gradient(135deg, #007bff, #00d4ff); color: white; padding: 30px; }
    </style>
</head>
<body>
    <div class="container py-5">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card booking-card">
                    <div class="header-section text-center">
                        <h3 class="fw-bold">ĐĂNG KÝ HẸN KHÁM CHI TIẾT</h3>
                        <p class="mb-0">Dành cho khách hàng đăng ký điều trị hiếm muộn</p>
                    </div>
                    <div class="card-body p-4">
                        <form id="formBooking">
                            @csrf
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label class="form-label fw-bold">Mã số bệnh nhân</label>
                                    <input type="text" name="user_id" class="form-control" placeholder="Ví dụ: BN123" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label fw-bold">Họ và Tên khách hàng</label>
                                    <input type="text" name="customer_name" class="form-control" placeholder="Nguyễn Văn A" required>
                                </div>
                            </div>

                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label class="form-label fw-bold">Dịch vụ điều trị</label>
                                    <select name="service_id" class="form-select" required>
                                        <option value="1">Thụ tinh nhân tạo (IUI)</option>
                                        <option value="2">Thụ tinh ống nghiệm (IVF)</option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label fw-bold">Bác sĩ khám</label>
                                    <select name="doctor_id" class="form-select" required>
                                        <option value="101">BS. Nguyễn Trường Giang</option>
                                        <option value="102">BS. Bùi Thanh Hậu</option>
                                    </select>
                                </div>
                            </div>

                            <div class="row mb-4">
                                <div class="col-md-6">
                                    <label class="form-label fw-bold">Ngày khám</label>
                                    <input type="date" name="appointment_date" class="form-control" min="{{ date('Y-m-d') }}" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label fw-bold">Khung giờ (1h/ca)</label>
                                    <select name="schedule_id" class="form-select" required>
                                        <optgroup label="Ca Sáng">
                                            <option value="8">08:00 - 09:00</option>
                                            <option value="9">09:00 - 10:00</option>
                                        </optgroup>
                                        <optgroup label="Ca Chiều">
                                            <option value="13">13:00 - 14:00</option>
                                            <option value="14">14:00 - 15:00</option>
                                        </optgroup>
                                    </select>
                                </div>
                            </div>

                            <button type="submit" class="btn btn-primary w-100 fw-bold py-2 shadow">GỬI YÊU CẦU ĐẶT LỊCH</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        document.getElementById('formBooking').onsubmit = function(e) {
            e.preventDefault();
            fetch('/api/bookings', {
                method: 'POST',
                body: new FormData(this),
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            })
            .then(res => res.json())
            .then(data => {
                if(data.status === 'success') {
                    Swal.fire({
                        icon: 'success',
                        title: 'Thành công!',
                        html: data.message, // Dùng html để hiện in đậm và xuống dòng
                        confirmButtonText: 'Đã rõ'
                    });
                    this.reset();
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Thất bại',
                        text: data.message || 'Vui lòng kiểm tra lại dữ liệu'
                    });
                }
            })
            .catch(error => {
                Swal.fire('Lỗi', 'Không thể kết nối đến máy chủ', 'error');
            });
        };
    </script>
</body>
</html>