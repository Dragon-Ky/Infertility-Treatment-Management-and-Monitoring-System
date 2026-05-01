import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiViewGrid,
  HiCheck,
  HiX,
  HiOutlineShieldCheck,
} from "react-icons/hi";
import { FaUser, FaStethoscope, FaCheckCircle } from "react-icons/fa";
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
import {
  getAllAppointments,
  confirmAppointment,
  cancelAppointment,
} from "@/services/appointmentService";
import { getCustomers } from "@/services/doctorService";
import { getDoctors } from "@/services/managerService";
import { getAllProtocols } from "@/services/protocolService";
import { getEventsByProtocol } from "@/services/eventService";

function DoctorAppointments() {
  const navigate = useNavigate();
  const [combinedSchedules, setCombinedSchedules] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [protocols, setProtocols] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      const [appRes, docRes, cusRes, protocolsRes] = await Promise.all([
        getAllAppointments(),
        getDoctors(),
        getCustomers(),
        getAllProtocols(),
      ]);

      const rawDoctors = docRes?.data ? docRes.data : docRes;
      setDoctors(Array.isArray(rawDoctors) ? rawDoctors : []);

      const rawCustomers = cusRes?.data ? cusRes.data : cusRes;
      setCustomers(Array.isArray(rawCustomers) ? rawCustomers : []);

      const rawProtocols = protocolsRes?.data
        ? protocolsRes.data
        : protocolsRes;
      const protocolsArray = Array.isArray(rawProtocols) ? rawProtocols : [];
      setProtocols(protocolsArray);

      // Map Lịch Hẹn (Appointment)
      const rawAppointments = appRes?.data ? appRes.data : appRes;
      const mappedAppointments = (
        Array.isArray(rawAppointments) ? rawAppointments : []
      ).map((app) => ({
        id: `app_${app.id}`,
        originalId: app.id,
        source: "appointment",
        type: app.type,
        date: app.appointment_date?.substring(0, 10),
        time: app.appointment_time?.substring(0, 5) || "00:00",
        status: app.status,
        doctorId: app.doctor_id,
        userId: app.user_id,
        notes: app.notes,
      }));

      // Map Sự kiện Điều trị (Treatment Events)
      let mappedEvents = [];
      for (const protocol of protocolsArray) {
        const evRes = await getEventsByProtocol(protocol.id);
        const eventsData = evRes?.data || evRes || [];

        const evts = eventsData.map((ev) => {
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
            status: ev.result ? "completed" : "confirmed",
            doctorId: protocol.doctor_id,
            userId:
              protocol.user_id || protocol.customer_id || protocol.treatment_id,
            notes: ev.description,
          };
        });
        mappedEvents = [...mappedEvents, ...evts];
      }

      // Gộp và Sắp xếp (Ưu tiên lịch mới nhất lên trên)
      const combined = [...mappedAppointments, ...mappedEvents].sort(
        (a, b) =>
          new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`),
      );

      setCombinedSchedules(combined);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu tổng hợp:", error);
      toast.error("Không thể tải dữ liệu lịch trình!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async (id) => {
    toast.promise(confirmAppointment(id), {
      loading: "Đang xác nhận lịch...",
      success: () => {
        fetchData();
        return <b>Đã tiếp nhận lịch khám!</b>;
      },
      error: <b>Không thể xác nhận. Vui lòng thử lại!</b>,
    });
  };

  const handleDecline = async (id) => {
    toast.promise(cancelAppointment(id), {
      loading: "Đang từ chối lịch...",
      success: () => {
        fetchData();
        return <b>Đã từ chối lịch khám!</b>;
      },
      error: <b>Lỗi hệ thống. Vui lòng thử lại!</b>,
    });
  };

  const formatToDDMMYYYY = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
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
      return `Bác sĩ ID: ${doctorId || "?"}`;
    const doc = doctors.find((d) => d.id.toString() === doctorId.toString());
    return doc ? doc.name : `Bác sĩ ID: ${doctorId}`;
  };

  const getCustomerName = (userId) => {
    if (!customers || customers.length === 0 || !userId)
      return `Mã KH: ${userId || "?"}`;
    const cus = customers.find((c) => c.id.toString() === userId.toString());
    return cus ? cus.name : `Mã KH: ${userId}`;
  };

  const renderStatusBadge = (item) => {
    if (item.source === "treatment_event" && item.status !== "completed") {
      return (
        <Badge className="border-none bg-blue-100 px-3 py-1 text-[9px] font-black tracking-widest text-blue-700 uppercase shadow-none">
          <HiOutlineShieldCheck className="mr-1" size={12} /> Chỉ định y khoa
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
            Bị hủy
          </Badge>
        );
      case "completed":
        return (
          <Badge className="border-none bg-slate-200 px-3 py-1 text-[9px] font-black tracking-widest text-slate-700 uppercase shadow-none">
            <FaCheckCircle className="mr-1" /> Hoàn tất
          </Badge>
        );
      default:
        return (
          <Badge className="animate-pulse border-none bg-amber-100 px-3 py-1 text-[9px] font-black tracking-widest text-amber-700 uppercase shadow-none">
            Chờ duyệt
          </Badge>
        );
    }
  };

  // Nhóm lịch theo khách hàng
  const groupedByCustomer = combinedSchedules.reduce((acc, item) => {
    const uid = item.userId || "Khách Vãng Lai";
    if (!acc[uid]) {
      acc[uid] = [];
    }
    acc[uid].push(item);
    return acc;
  }, {});

  const calendarEvents = combinedSchedules.map((app) => {
    let bgColor = "#f59e0b";
    if (app.status === "confirmed") bgColor = "#22c55e";
    if (app.source === "treatment_event") bgColor = "#3b82f6";
    if (app.status === "cancelled") bgColor = "#ef4444";
    if (app.status === "completed") bgColor = "#64748b";

    const customerName = getCustomerName(app.userId);

    return {
      id: app.id,
      title: `${app.source === "treatment_event" ? "⭐ " : ""}${app.time} | ${customerName}`,
      date: app.date,
      backgroundColor: bgColor,
      borderColor: "transparent",
    };
  });

  const renderScheduleCard = (item) => {
    const isTreatmentEvent = item.source === "treatment_event";
    const isPendingAppt =
      !isTreatmentEvent && (!item.status || item.status === "scheduled");
    const isConfirmed =
      item.status === "confirmed" ||
      (isTreatmentEvent && item.status !== "completed");
    const isCompleted = item.status === "completed";

    return (
      <Card
        key={item.id}
        className={`group relative flex h-full flex-col overflow-hidden rounded-[32px] border-2 bg-white shadow-sm transition-all hover:shadow-lg ${
          isTreatmentEvent
            ? "border-blue-100 bg-gradient-to-br from-white to-blue-50/30"
            : isPendingAppt
              ? "border-amber-100"
              : isCompleted
                ? "border-slate-200 opacity-75"
                : "border-slate-100 hover:border-blue-100"
        }`}
      >
        {isTreatmentEvent && !isCompleted && (
          <div className="absolute top-0 right-0 z-10 rounded-bl-2xl bg-blue-500 px-3 py-1 text-[8px] font-black tracking-widest text-white uppercase shadow-sm">
            LỘ TRÌNH ĐIỀU TRỊ
          </div>
        )}

        <CardContent className="flex flex-1 flex-col p-6">
          <div className="mb-6 flex items-start justify-between">
            <div className="mt-1 flex items-center gap-3">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-colors ${
                  isCompleted
                    ? "bg-slate-100 text-slate-400"
                    : isTreatmentEvent
                      ? "bg-blue-600 text-white"
                      : isPendingAppt
                        ? "bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white"
                        : "bg-green-50 text-green-600 group-hover:bg-green-500 group-hover:text-white"
                }`}
              >
                <FaStethoscope size={22} />
              </div>
              <div>
                <h4
                  className={`text-sm font-black tracking-tight uppercase ${isCompleted ? "text-slate-500 line-through decoration-slate-300" : "text-slate-800"}`}
                >
                  {getTypeLabel(item.type)}
                </h4>
                <p className="mt-0.5 text-[10px] font-bold text-slate-400">
                  Mã: #{item.originalId} {isTreatmentEvent ? "(Sự kiện)" : ""}
                </p>
              </div>
            </div>
            <div className="ml-2 shrink-0">{renderStatusBadge(item)}</div>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-3">
              <p className="mb-1 flex items-center gap-1.5 text-[9px] font-black tracking-widest text-slate-400 uppercase">
                <FaUser size={10} /> KHÁCH HÀNG
              </p>
              <p
                className={`truncate text-sm font-black ${isCompleted ? "text-slate-400" : "text-slate-700"}`}
                title={getCustomerName(item.userId)}
              >
                {getCustomerName(item.userId)}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-3">
              <p className="mb-1 flex items-center gap-1.5 text-[9px] font-black tracking-widest text-slate-400 uppercase">
                <HiOutlineClock size={12} /> THỜI GIAN
              </p>
              <p
                className={`text-sm font-black ${isCompleted ? "text-slate-400" : "text-(--primaryCustom)"}`}
              >
                {item.time} - {formatToDDMMYYYY(item.date)}
              </p>
            </div>
          </div>

          <div className="mb-4 flex items-center justify-between px-2">
            <p className="text-[10px] font-bold text-slate-400">
              Bác sĩ:{" "}
              <span className="text-slate-700 uppercase">
                {getDoctorName(item.doctorId)}
              </span>
            </p>
          </div>

          {item.notes ? (
            <div className="mb-4 rounded-xl border border-slate-100 bg-slate-50/50 p-3 text-xs font-medium text-slate-500 italic">
              {isTreatmentEvent ? "Chỉ định: " : "Ghi chú: "} "{item.notes}"
            </div>
          ) : (
            <div className="mb-4"></div>
          )}

          <div className="mt-auto w-full pt-4">
            {/* THIẾT KẾ MỚI KÈM NÚT HỒ SƠ ĐÃ SỬA LỖI ĐIỀU HƯỚNG */}
            {isConfirmed && (
              <div className="flex items-center justify-between rounded-xl border border-green-100 bg-green-50/50 p-3">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
                  </span>
                  <span className="text-[9px] font-black tracking-widest text-green-700 uppercase">
                    Sẵn sàng đón tiếp
                  </span>
                </div>
                <Button
                  onClick={() => {
                    // Dùng logic xịn từ Dashboard để dò đúng phác đồ
                    const patientProtocol = protocols.find(
                      (p) =>
                        String(p.user_id) === String(item.userId) ||
                        String(p.treatment_id) === String(item.userId) ||
                        String(p.customer_id) === String(item.userId),
                    );

                    if (patientProtocol) {
                      navigate(
                        `/doctor/protocols/details/${patientProtocol.id}`,
                      );
                    } else {
                      toast.error("Bệnh nhân này chưa có Phác đồ điều trị!");
                    }
                  }}
                  variant="outline"
                  className="h-8 cursor-pointer rounded-lg border-green-200 bg-white px-3 text-[9px] font-black text-green-600 uppercase shadow-none transition-colors hover:bg-green-100 hover:text-green-700 active:scale-95"
                >
                  Hồ sơ
                </Button>
              </div>
            )}

            {isPendingAppt && (
              <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-11 w-full cursor-pointer rounded-xl border-red-200 text-[10px] font-black tracking-widest text-red-500 uppercase shadow-none hover:bg-red-50"
                    >
                      <HiX size={14} className="mr-1" /> TỪ CHỐI
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-[32px] border-none p-8 shadow-2xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-xl font-black uppercase">
                        Từ chối lịch khám?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="font-bold text-slate-400 italic">
                        Khách hàng sẽ nhận được thông báo hủy lịch này.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="h-12 cursor-pointer rounded-2xl border-none bg-slate-100 font-black uppercase">
                        Quay lại
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDecline(item.originalId)}
                        className="h-12 cursor-pointer rounded-2xl bg-red-500 font-black text-white uppercase hover:bg-red-600"
                      >
                        Đồng ý từ chối
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="h-11 w-full cursor-pointer rounded-xl bg-(--primaryCustom) text-[10px] font-black tracking-widest text-white uppercase shadow-md shadow-blue-200 transition-opacity hover:opacity-90">
                      <HiCheck size={14} className="mr-1" /> TIẾP NHẬN
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-[32px] border-none p-8 shadow-2xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-xl font-black uppercase">
                        Xác nhận tiếp nhận?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="font-bold text-slate-400 italic">
                        Hệ thống sẽ chốt lịch khám này cho Bác sĩ{" "}
                        {getDoctorName(item.doctorId)}.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="h-12 cursor-pointer rounded-2xl border-none bg-slate-100 font-black uppercase">
                        Quay lại
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleConfirm(item.originalId)}
                        className="h-12 cursor-pointer rounded-2xl bg-(--primaryCustom)! font-black uppercase hover:opacity-90"
                      >
                        Xác nhận lịch
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="mx-auto min-h-screen max-w-7xl bg-slate-50/50 px-4 py-8">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-2xl font-black tracking-tighter text-slate-800 uppercase">
            Quản Lý Lịch Hẹn & Lộ Trình
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Duyệt lịch và quản lý lộ trình theo từng Bệnh nhân riêng biệt.
          </p>
        </div>

        <div className="flex items-center rounded-2xl border border-slate-100 bg-white p-1 shadow-sm">
          <button
            onClick={() => setViewMode("grid")}
            className={`flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-[10px] font-black tracking-widest uppercase transition-all ${viewMode === "grid" ? "bg-(--primaryCustom) text-white shadow-md shadow-blue-200" : "text-slate-400 hover:text-slate-600"}`}
          >
            <HiViewGrid size={16} /> Danh sách
          </button>
          <button
            onClick={() => setViewMode("calendar")}
            className={`flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-[10px] font-black tracking-widest uppercase transition-all ${viewMode === "calendar" ? "bg-(--primaryCustom) text-white shadow-md shadow-blue-200" : "text-slate-400 hover:text-slate-600"}`}
          >
            <HiOutlineCalendar size={16} /> Lịch tháng
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-[32px] border border-slate-100 bg-white shadow-sm">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-(--primaryCustom)"></div>
        </div>
      ) : combinedSchedules.length > 0 ? (
        <>
          {viewMode === "grid" && (
            <div className="space-y-12">
              {/* Render theo khách hàng */}
              {Object.entries(groupedByCustomer).map(([userId, schedules]) => (
                <div
                  key={userId}
                  className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
                >
                  <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-xl text-blue-600">
                        <FaUser />
                      </div>
                      <div>
                        <h4 className="text-xl font-black tracking-tight text-slate-800 uppercase">
                          {getCustomerName(userId)}
                        </h4>
                        <p className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                          Mã KH: #{userId} • {schedules.length} lịch trình
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Grid của từng người */}
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {schedules.map((item) => renderScheduleCard(item))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {viewMode === "calendar" && (
            <div className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm">
              <style>{`
                .fc .fc-toolbar-title { font-size: 1.25rem; font-weight: 900; text-transform: uppercase; color: #1e293b; }
                .fc .fc-button-primary { background-color: var(--primaryCustom); border: none; border-radius: 12px; text-transform: uppercase; font-size: 10px; font-weight: 900; letter-spacing: 0.1em; }
                .fc .fc-button-primary:hover { background-color: var(--primaryCustom); opacity: 0.9; }
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
                buttonText={{ today: "Hôm nay", month: "Tháng", week: "Tuần" }}
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
                    Lịch đã xác nhận
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-amber-500"></span>
                  <span className="text-xs font-bold text-slate-600">
                    Đang chờ duyệt
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-slate-500"></span>
                  <span className="text-xs font-bold text-slate-600">
                    Đã khám xong
                  </span>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-[32px] border border-slate-100 bg-white py-24 text-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-50 text-slate-300">
            <HiOutlineCalendar className="text-5xl" />
          </div>
          <h3 className="text-xl font-bold text-slate-700">
            Hệ thống chưa có lịch hẹn nào
          </h3>
        </div>
      )}
    </div>
  );
}

export default DoctorAppointments;
