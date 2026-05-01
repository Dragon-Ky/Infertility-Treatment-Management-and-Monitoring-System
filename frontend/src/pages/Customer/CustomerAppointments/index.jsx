import { useState, useEffect } from "react";
import {
  HiOutlineCalendar,
  HiPlus,
  HiOutlineClock,
  HiViewGrid,
  HiOutlineShieldCheck,
  HiOutlineUserCircle,
} from "react-icons/hi";
import { FaUserMd, FaStethoscope } from "react-icons/fa";
import toast from "react-hot-toast";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import AddAppointmentModal from "@/components/AddAppointmentModal";

// IMPORT API TỪ 2 MICROSERVICES KHÁC NHAU
import {
  getAllAppointments,
  cancelAppointment,
} from "@/services/appointmentService";
import { getDoctors } from "@/services/managerService";
import { getAllProtocols } from "@/services/protocolService";
import { getEventsByProtocol } from "@/services/eventService";

function CustomerAppointments() {
  const [combinedSchedules, setCombinedSchedules] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const userStr = localStorage.getItem("user");
      const currentUser = userStr ? JSON.parse(userStr) : null;

      if (!currentUser) return;

      // 1. GỌI API LẤY LỊCH TỪ APPOINTMENT SERVICE (Lịch khách tự đặt)
      const [appRes, docRes, protocolsRes] = await Promise.all([
        getAllAppointments(),
        getDoctors(),
        getAllProtocols(), // Lấy phác đồ để tìm Events
      ]);

      const rawDoctors = docRes?.data ? docRes.data : docRes;
      setDoctors(Array.isArray(rawDoctors) ? rawDoctors : []);

      // Lọc lịch tự đặt của User này
      const rawApps = appRes?.data ? appRes.data : appRes;
      const myAppointments = (Array.isArray(rawApps) ? rawApps : [])
        .filter((app) => String(app.user_id) === String(currentUser.id))
        .map((app) => ({
          id: `app_${app.id}`,
          originalId: app.id,
          source: "appointment",
          type: app.type,
          date: app.appointment_date.substring(0, 10),
          time: app.appointment_time?.substring(0, 5) || "00:00",
          status: app.status,
          doctorId: app.doctor_id,
          notes: app.notes,
        }));

      // 2. GỌI API LẤY EVENTS TỪ TREATMENT SERVICE (Lịch Bác sĩ chỉ định)
      const rawProtocols = protocolsRes?.data
        ? protocolsRes.data
        : protocolsRes;
      const myProtocols = (
        Array.isArray(rawProtocols) ? rawProtocols : []
      ).filter(
        (p) =>
          String(p.user_id) === String(currentUser.id) ||
          String(p.treatment_id) === String(currentUser.id),
      );

      let myEvents = [];
      for (const protocol of myProtocols) {
        const evRes = await getEventsByProtocol(protocol.id);
        const eventsData = evRes?.data || evRes || [];

        // Chuẩn hóa Event thành chung cấu trúc
        const mappedEvents = eventsData.map((ev) => {
          // FIX LỖI SPLIT NGÀY GIỜ: Chuẩn hóa chữ 'T' thành dấu cách trước khi cắt
          const normalizedDate = (ev.event_date || "").replace("T", " ");
          const parts = normalizedDate.split(" ");
          const evDate = parts[0];
          const evTime = parts.length > 1 ? parts[1].substring(0, 5) : "08:00";

          return {
            id: `evt_${ev.id}`,
            originalId: ev.id,
            source: "treatment_event",
            type: ev.event_type,
            date: evDate,
            time: evTime,
            status: "confirmed", // Event bác sĩ tạo mặc định Đã xác nhận
            doctorId: protocol.doctor_id, // Lấy Bác sĩ của phác đồ
            notes: ev.description,
            protocolId: protocol.id,
          };
        });
        myEvents = [...myEvents, ...mappedEvents];
      }

      // 3. GỘP CHUNG LẠI VÀ SẮP XẾP THEO NGÀY GIỜ TĂNG DẦN
      const combined = [...myAppointments, ...myEvents].sort(
        (a, b) =>
          new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`),
      );

      setCombinedSchedules(combined);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu tổng hợp:", error);
      toast.error("Không thể tải dữ liệu lịch trình.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelAppointment = async (id) => {
    toast.promise(cancelAppointment(id), {
      loading: "Đang xử lý hủy lịch...",
      success: () => {
        fetchData();
        return <b>Đã hủy lịch hẹn thành công!</b>;
      },
      error: <b>Không thể hủy lịch. Vui lòng thử lại sau!</b>,
    });
  };

  const formatToDDMMYYYY = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const d = String(date.getDate()).padStart(2, "0");
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  };

  const getTypeLabel = (type) => {
    const types = {
      consultation: "Khám tư vấn",
      ultrasound: "Siêu âm",
      blood_test: "Xét nghiệm máu",
      injection: "Tiêm thuốc",
      egg_retrieval: "Chọc hút trứng",
      embryo_transfer: "Chuyển phôi",
      insemination: "Thụ tinh",
      other: "Khác",
    };
    return types[type] || type || "Khám bệnh";
  };

  const getDoctorName = (doctorId) => {
    if (!doctors || doctors.length === 0 || !doctorId)
      return `Bác sĩ chuyên khoa`;
    const doc = doctors.find((d) => d.id.toString() === doctorId.toString());
    return doc ? doc.name : `Bác sĩ chuyên khoa`;
  };

  // ĐỒNG BỘ TEXT BADGE
  const renderStatusBadge = (item) => {
    if (item.source === "treatment_event") {
      return (
        <Badge className="border-none bg-blue-100 px-3 py-1 text-[9px] font-black tracking-widest text-blue-700 uppercase shadow-none">
          <HiOutlineShieldCheck className="mr-1" size={12} /> Bác sĩ Chỉ định
        </Badge>
      );
    }

    switch (item.status) {
      case "confirmed":
        return (
          <Badge className="border-none bg-green-100 px-3 py-1 text-[9px] font-black tracking-widest text-green-700 uppercase shadow-none">
            Đã xác nhận
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="border-none bg-red-100 px-3 py-1 text-[9px] font-black tracking-widest text-red-700 uppercase shadow-none">
            Đã hủy
          </Badge>
        );
      case "completed":
        return (
          <Badge className="border-none bg-slate-200 px-3 py-1 text-[9px] font-black tracking-widest text-slate-700 uppercase shadow-none">
            Hoàn thành
          </Badge>
        );
      default:
        return (
          <Badge className="border-none bg-amber-100 px-3 py-1 text-[9px] font-black tracking-widest text-amber-700 uppercase shadow-none">
            Chờ xác nhận
          </Badge>
        );
    }
  };

  // Map sang Calendar
  const calendarEvents = combinedSchedules.map((app) => {
    let bgColor = "#f59e0b"; // Vàng: Chờ
    if (app.status === "confirmed") bgColor = "#22c55e"; // Xanh lá
    if (app.source === "treatment_event") bgColor = "#3b82f6"; // Xanh dương cho Bác sĩ chỉ định
    if (app.status === "cancelled") bgColor = "#ef4444";
    if (app.status === "completed") bgColor = "#64748b";

    return {
      id: app.id,
      title: `${app.source === "treatment_event" ? "⭐ " : ""}${getTypeLabel(app.type)}`,
      date: app.date,
      backgroundColor: bgColor,
      borderColor: "transparent",
    };
  });

  // TÁCH MẢNG DATA ĐỂ HIỂN THỊ RA UI RÕ RÀNG
  const doctorSchedules = combinedSchedules.filter(
    (item) => item.source === "treatment_event",
  );
  const personalSchedules = combinedSchedules.filter(
    (item) => item.source === "appointment",
  );

  // HÀM RENDER COMPONENT THẺ (Để tránh lặp lại code)
  const renderScheduleCard = (item) => {
    const isDoctorPrescribed = item.source === "treatment_event";
    return (
      <div
        key={item.id}
        className={`group relative flex flex-col overflow-hidden rounded-[32px] border-2 bg-white p-6 shadow-sm transition-all hover:shadow-md ${
          isDoctorPrescribed
            ? "border-blue-200 bg-gradient-to-b from-blue-50/50 to-white hover:border-blue-300"
            : "border-slate-100 hover:border-slate-200"
        }`}
      >
        {isDoctorPrescribed && (
          <div className="absolute top-0 right-0 rounded-bl-2xl bg-blue-500 px-3 py-1 text-[8px] font-black tracking-widest text-white uppercase shadow-sm">
            LỘ TRÌNH ĐIỀU TRỊ
          </div>
        )}

        <div className="mt-2 mb-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-colors ${isDoctorPrescribed ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"}`}
            >
              <FaStethoscope size={22} />
            </div>
            <div>
              <h4 className="text-sm font-black tracking-tight text-slate-800 uppercase">
                {getTypeLabel(item.type)}
              </h4>
              <p className="mt-0.5 text-[10px] font-bold text-slate-400">
                Mã LH: #{item.originalId}
              </p>
            </div>
          </div>
          {renderStatusBadge(item)}
        </div>

        <div
          className={`mb-4 rounded-2xl p-4 ${isDoctorPrescribed ? "border border-blue-100 bg-white" : "bg-slate-50"}`}
        >
          <p className="mb-1 text-[9px] font-black tracking-widest text-slate-400 uppercase">
            Bác sĩ phụ trách
          </p>
          <div className="flex items-center gap-2">
            <FaUserMd
              className={
                isDoctorPrescribed ? "text-blue-500" : "text-slate-400"
              }
            />
            <p className="line-clamp-1 text-sm font-black text-slate-800 uppercase">
              {getDoctorName(item.doctorId)}
            </p>
          </div>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3">
          <div
            className={`rounded-2xl border p-3 ${isDoctorPrescribed ? "border-blue-100 bg-white" : "border-slate-100"}`}
          >
            <p className="mb-1 flex items-center gap-1.5 text-[9px] font-black tracking-widest text-slate-400 uppercase">
              <HiOutlineCalendar size={12} /> NGÀY KHÁM
            </p>
            <p
              className={`text-sm font-black ${isDoctorPrescribed ? "text-blue-600" : "text-(--primaryCustom)"}`}
            >
              {formatToDDMMYYYY(item.date)}
            </p>
          </div>
          <div
            className={`rounded-2xl border p-3 ${isDoctorPrescribed ? "border-blue-100 bg-white" : "border-slate-100"}`}
          >
            <p className="mb-1 flex items-center gap-1.5 text-[9px] font-black tracking-widest text-slate-400 uppercase">
              <HiOutlineClock size={12} /> GIỜ DỰ KIẾN
            </p>
            <p className="text-sm font-black text-amber-600">{item.time}</p>
          </div>
        </div>

        {item.notes && (
          <div className="mb-4 rounded-xl border border-slate-100 bg-slate-50/50 p-3 text-xs font-medium text-slate-500 italic">
            {isDoctorPrescribed ? "Chỉ định: " : "Ghi chú: "} "{item.notes}"
          </div>
        )}

        <div className="mt-auto pt-2">
          {/* Chỉ cho phép HỦY nếu là LỊCH TỰ ĐẶT */}
          {!isDoctorPrescribed &&
            (!item.status || item.status === "scheduled") && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-10 w-full cursor-pointer rounded-xl border-red-200 text-[10px] font-black tracking-widest text-red-500 uppercase transition-colors hover:bg-red-50 hover:text-red-600 active:scale-95"
                  >
                    Hủy lịch tự đặt
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="z-[10001] rounded-[32px] border-none p-8 shadow-2xl sm:max-w-[450px]">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-black tracking-tighter text-slate-800 uppercase">
                      Xác nhận hủy lịch?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="font-bold text-slate-400 italic">
                      "Hành động này sẽ hủy lịch hẹn tư vấn của bạn."
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="mt-6 gap-3">
                    <AlertDialogCancel className="h-12 rounded-2xl bg-slate-100 font-black uppercase">
                      Quay lại
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleCancelAppointment(item.originalId)}
                      className="h-12 rounded-2xl bg-red-500 font-black text-white uppercase hover:bg-red-600"
                    >
                      Đồng ý hủy
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          {isDoctorPrescribed && (
            <p className="mt-2 text-center text-[9px] font-bold text-slate-400 italic">
              Bác sĩ đã lên lịch trình này. Nếu cần đổi, vui lòng liên hệ phòng
              khám.
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-2xl font-black tracking-tighter text-slate-800 uppercase">
            Lịch Hẹn & Lộ Trình Điều Trị
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Tổng hợp lịch bạn tự đặt và Lộ trình do Bác sĩ chỉ định.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-2xl bg-slate-100 p-1 shadow-inner">
            <button
              onClick={() => setViewMode("grid")}
              className={`flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-[10px] font-black tracking-widest uppercase transition-all ${viewMode === "grid" ? "bg-white text-(--primaryCustom) shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
            >
              <HiViewGrid size={16} /> Danh sách
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className={`flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-[10px] font-black tracking-widest uppercase transition-all ${viewMode === "calendar" ? "bg-white text-(--primaryCustom) shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
            >
              <HiOutlineCalendar size={16} /> Lịch tháng
            </button>
          </div>

          <Button
            onClick={() => setIsOpenModal(true)}
            className="h-11 cursor-pointer rounded-2xl bg-(--primaryCustom) px-5 text-[10px] font-black tracking-widest text-white shadow-lg shadow-blue-100 transition-all hover:bg-blue-600 active:scale-95"
          >
            <HiPlus className="mr-2" size={16} /> ĐẶT LỊCH TƯ VẤN
          </Button>
        </div>
      </div>

      <AddAppointmentModal
        isOpen={isOpenModal}
        onOpenChange={setIsOpenModal}
        onAdded={fetchData}
      />

      <Card className="overflow-hidden rounded-[32px] border-none border-slate-100 bg-transparent shadow-[0px_3px_8px_rgba(0,0,0,0.05)] shadow-sm">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center rounded-[32px] bg-white">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-(--primaryCustom)"></div>
            </div>
          ) : combinedSchedules.length > 0 ? (
            <>
              {/* DẠNG GRID ĐÃ ĐƯỢC CHIA KHU VỰC RÕ RÀNG */}
              {viewMode === "grid" && (
                <div className="space-y-12">
                  {/* KHU VỰC 1: LỘ TRÌNH CỦA BÁC SĨ */}
                  {doctorSchedules.length > 0 && (
                    <div>
                      <h4 className="mb-6 flex items-center gap-2 text-lg font-black tracking-tight text-slate-800 uppercase">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                          <HiOutlineShieldCheck size={24} />
                        </div>
                        Lộ trình Bác sĩ chỉ định
                      </h4>
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {doctorSchedules.map((item) =>
                          renderScheduleCard(item),
                        )}
                      </div>
                    </div>
                  )}

                  {/* KHU VỰC 2: LỊCH KHÁCH TỰ ĐẶT */}
                  {personalSchedules.length > 0 && (
                    <div
                      className={
                        doctorSchedules.length > 0
                          ? "border-t-2 border-dashed border-slate-100 pt-8"
                          : ""
                      }
                    >
                      <h4 className="mb-6 flex items-center gap-2 text-lg font-black tracking-tight text-slate-800 uppercase">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                          <HiOutlineUserCircle size={24} />
                        </div>
                        Lịch cá nhân tự đặt
                      </h4>
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {personalSchedules.map((item) =>
                          renderScheduleCard(item),
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* LỊCH THÁNG KHÔNG ĐỔI */}
              {viewMode === "calendar" && (
                <div className="rounded-[32px] bg-white p-6 shadow-sm">
                  <style>{`
                    .fc .fc-toolbar-title { font-size: 1.25rem; font-weight: 900; text-transform: uppercase; color: #1e293b; }
                    .fc .fc-button-primary { background-color: var(--primaryCustom); border: none; border-radius: 12px; text-transform: uppercase; font-size: 10px; font-weight: 900; letter-spacing: 0.1em; }
                    .fc .fc-button-primary:hover { background-color: #2563eb; }
                    .fc .fc-daygrid-event { border-radius: 6px; padding: 4px; font-size: 10px; font-weight: 700; cursor: pointer; transition: transform 0.1s;}
                    .fc .fc-daygrid-event:hover { transform: scale(1.02); }
                  `}</style>
                  <FullCalendar
                    plugins={[dayGridPlugin]}
                    initialView="dayGridMonth"
                    events={calendarEvents}
                    height="auto"
                    headerToolbar={{
                      left: "prev,next today",
                      center: "title",
                      right: "dayGridMonth,dayGridWeek",
                    }}
                    buttonText={{
                      today: "Hôm nay",
                      month: "Tháng",
                      week: "Tuần",
                    }}
                    locale="vi"
                  />

                  <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-4">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-blue-500"></span>
                      <span className="text-xs font-bold text-slate-600">
                        Lộ trình Y khoa
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-green-500"></span>
                      <span className="text-xs font-bold text-slate-600">
                        Lịch tự đặt (Đã xác nhận)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-amber-500"></span>
                      <span className="text-xs font-bold text-slate-600">
                        Đang chờ xác nhận
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-[32px] bg-white py-24 text-center">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-50 text-(--primaryCustom)">
                <HiOutlineCalendar className="text-5xl" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-slate-700">
                Chưa có lịch trình
              </h3>
              <p className="mb-8 max-w-md text-slate-500">
                Bạn chưa có lịch hẹn nào. Bác sĩ sẽ cập nhật lộ trình khi bạn
                bắt đầu điều trị.
              </p>
              <Button
                onClick={() => setIsOpenModal(true)}
                variant="outline"
                className="h-12 rounded-2xl border-2 border-(--primaryCustom) px-6 font-black text-(--primaryCustom) uppercase hover:bg-blue-50"
              >
                <HiOutlineClock className="mr-2" size={16} /> ĐẶT LỊCH TƯ VẤN
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default CustomerAppointments;
