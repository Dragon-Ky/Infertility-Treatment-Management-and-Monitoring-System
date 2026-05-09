import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  HiOutlineUser,
  HiOutlineIdentification,
  HiOutlineHashtag,
  HiOutlineFingerPrint,
  HiOutlineClipboardList,
  HiOutlineBell,
} from "react-icons/hi";
import { Button } from "@/components/ui/button";
import { sendEmailNotification } from "@/services/notificationService";
import toast from "react-hot-toast";


function PatientProfile({ protocol, customer }) {
  const userStr = localStorage.getItem("user");
  const currentUser = userStr ? JSON.parse(userStr) : null;

  const doctorName =
    protocol.doctor_name ||
    (currentUser?.id === protocol.doctor_id
      ? currentUser.name
      : `BS. #${protocol.doctor_id}`);

  // Hàm đếm số ngày điều trị
  const calculateTreatmentDays = (startDateString) => {
    if (!startDateString) return 1;
    try {
      const safeStr = startDateString.includes("T")
        ? startDateString
        : startDateString.replace(" ", "T");
      const start = new Date(safeStr);

      if (isNaN(start.getTime())) return 1;

      const today = new Date();
      const diffTime = Math.abs(today.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 1;
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      return 1;
    }
  };

  const formatShortDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const datePart = dateString.split("T")[0].split(" ")[0];
      const parts = datePart.split("-");

      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }

      // Fallback
      return datePart;
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      return "N/A";
    }
  };

  const treatmentDays = calculateTreatmentDays(protocol.created_at);
  const isActive = protocol.is_active === 1 || protocol.is_active === true;

  const handleSendQuickEmail = async () => {
    try {
      if (!customer || !customer.email) {
        toast.error("Bệnh nhân chưa cập nhật email!");
        return;
      }

      const doctorStr = localStorage.getItem("user");
      const currentDoctor = doctorStr ? JSON.parse(doctorStr) : null;

      const emailData = {
        user_id: customer.id,
        email: customer.email,
        user_name: customer.name,
        appointment_type: "Thông báo từ bác sĩ",
        appointment_date: new Date().toLocaleDateString("vi-VN"),
        appointment_time: new Date().toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        doctor_name: currentDoctor?.name || doctorName,
        notes: "Bác sĩ đang theo dõi tiến trình điều trị của bạn. Vui lòng kiểm tra lịch hẹn mới nhất trên hệ thống.",
      };

      await toast.promise(sendEmailNotification(emailData), {
        loading: "Đang gửi email...",
        success: "Đã gửi thông báo đến bệnh nhân!",
        error: "Gửi email thất bại!",
      });
    } catch (error) {
      console.error("Lỗi gửi email:", error);
    }
  };


  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Thẻ Profile */}
      <Card className="overflow-hidden rounded-[32px] border-none bg-white shadow-sm lg:col-span-2">
        <div className="flex flex-col items-center gap-8 p-8 md:flex-row">
          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center rounded-[32px] bg-slate-900 text-3xl font-black text-white shadow-2xl">
              {customer?.name?.charAt(0) || "?"}
            </div>
            <div className="absolute -right-2 -bottom-2 flex h-10 w-10 items-center justify-center rounded-2xl border-4 border-white bg-(--primaryCustom) text-white shadow-lg">
              <HiOutlineIdentification size={20} />
            </div>
          </div>
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center gap-3 md:justify-start">
              <h2 className="text-3xl leading-none font-black tracking-tighter text-slate-800 uppercase">
                {customer
                  ? customer.name
                  : `Bệnh nhân #${protocol.treatment_id}`}
              </h2>
              <Badge
                className={
                  isActive
                    ? "animate-pulse rounded-xl border-none bg-green-100 px-3 py-1 text-[10px] font-black text-green-700 shadow-none"
                    : "rounded-xl border-none bg-slate-100 px-3 py-1 text-[10px] font-black text-slate-500 shadow-none"
                }
              >
                {isActive ? "ĐANG ĐIỀU TRỊ" : "ĐÃ KẾT THÚC"}
              </Badge>
            </div>
            <div className="flex items-center justify-center gap-2 md:justify-start">
              <p className="text-sm font-bold text-slate-400">
                {customer?.email || "Chưa cập nhật email"} -{" "}
                {customer?.phone || "Chưa cập nhật SĐT"}
              </p>
              {customer?.email && (
                <Button
                  onClick={handleSendQuickEmail}
                  variant="ghost"
                  className="h-6 w-6 cursor-pointer rounded-full p-0 text-blue-500 hover:bg-blue-50"
                  title="Gửi thông báo nhanh"
                >
                  <HiOutlineBell size={14} />
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <div className="flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1 text-[10px] font-black text-(--primaryCustom) uppercase">
                <HiOutlineHashtag size={14} /> ID:{" "}
                {protocol.id || protocol.treatment_id}
              </div>

              <div className="flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1 text-[10px] font-black text-slate-400 uppercase">
                <HiOutlineUser size={14} /> {doctorName}
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="group relative flex flex-col justify-between overflow-hidden rounded-[32px] border-none bg-(--primaryCustom) p-8 text-white shadow-xl transition-all hover:shadow-2xl hover:shadow-blue-200/50">
        {/* Background*/}
        <HiOutlineFingerPrint
          size={180}
          className="absolute -top-10 -right-10 rotate-12 text-white opacity-10 transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-white opacity-5 blur-3xl"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <h3 className="mb-2 text-[10px] font-black tracking-[0.3em] text-blue-200 uppercase">
              Mã Phác Đồ Y Khoa
            </h3>
            <HiOutlineClipboardList className="text-blue-200" size={18} />
          </div>

          <h2
            className="mb-6 truncate text-2xl font-black tracking-widest sm:text-3xl"
            title={protocol.protocol_code}
          >
            {protocol.protocol_code || "CHƯA CẤP MÃ"}
          </h2>

          <div className="rounded-2xl bg-white/10 p-3 backdrop-blur-sm">
            <p className="mb-1 text-[9px] font-black tracking-widest text-blue-200 uppercase">
              Chẩn đoán lâm sàng
            </p>
            <p
              className="truncate text-sm font-bold"
              title={protocol.diagnosis}
            >
              {protocol.diagnosis || "Đang cập nhật..."}
            </p>
          </div>
        </div>

        <div className="relative z-10 mt-6 flex items-end justify-between border-t border-white/20 pt-4">
          <div>
            <p className="mb-1 text-[9px] font-bold tracking-widest text-blue-200 uppercase">
              Thời gian chạy
            </p>
            <p className="text-xl font-black tracking-tighter">
              {isActive ? `Ngày thứ ${treatmentDays}` : "Đã đóng"}
            </p>
          </div>
          <div className="text-right">
            <p className="mb-1 text-[9px] font-bold tracking-widest text-blue-200 uppercase">
              Khởi tạo lúc
            </p>
            <p className="text-sm font-black">
              {formatShortDate(protocol.created_at)}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default PatientProfile;
