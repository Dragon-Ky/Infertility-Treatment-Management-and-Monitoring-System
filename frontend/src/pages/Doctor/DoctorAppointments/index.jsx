import { useState, useEffect } from "react";
import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiViewGrid,
  HiCheck,
  HiX,
} from "react-icons/hi";
import { FaUser, FaStethoscope } from "react-icons/fa";
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

function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      // Gọi 3 Api
      const [appRes, docRes, cusRes] = await Promise.all([
        getAllAppointments(),
        getDoctors(),
        getCustomers(),
      ]);

      // Set Lịch Hẹn
      const rawAppointments = appRes?.data ? appRes.data : appRes;
      const appointmentsArray = Array.isArray(rawAppointments)
        ? rawAppointments
        : [];
      const sortedData = [...appointmentsArray].sort(
        (a, b) => new Date(b.appointment_date) - new Date(a.appointment_date),
      );
      setAppointments(sortedData);

      // Set Bác Sĩ
      const rawDoctors = docRes?.data ? docRes.data : docRes;
      setDoctors(Array.isArray(rawDoctors) ? rawDoctors : []);

      // Set Khách Hàng
      const rawCustomers = cusRes?.data ? cusRes.data : cusRes;
      setCustomers(Array.isArray(rawCustomers) ? rawCustomers : []);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
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
      loading: "Đang hủy lịch...",
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
    };
    return types[type] || "Khám bệnh";
  };

  const getDoctorName = (doctorId) => {
    if (!doctors || doctors.length === 0) return `ID: ${doctorId}`;
    const doc = doctors.find((d) => d.id.toString() === doctorId.toString());
    return doc ? doc.name : `ID: ${doctorId}`;
  };

  const getCustomerName = (userId) => {
    if (!customers || customers.length === 0) return `Mã KH: ${userId}`;
    const cus = customers.find((c) => c.id.toString() === userId.toString());
    return cus ? cus.name : `Mã KH: ${userId}`;
  };

  const renderStatusBadge = (status) => {
    switch (status) {
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
            Hoàn tất
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

  const calendarEvents = appointments.map((app) => {
    let bgColor = "#f59e0b";
    if (app.status === "confirmed") bgColor = "#22c55e";
    if (app.status === "cancelled") bgColor = "#ef4444";
    if (app.status === "completed") bgColor = "#64748b";

    const customerName = getCustomerName(app.user_id);

    return {
      id: app.id,
      title: `${app.appointment_time?.substring(0, 5)} | ${customerName}`,
      date: app.appointment_date.substring(0, 10),
      backgroundColor: bgColor,
      borderColor: "transparent",
    };
  });

  return (
    <div className="mx-auto min-h-screen max-w-7xl bg-slate-50/50 px-4 py-8">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-2xl font-black tracking-tighter text-slate-800 uppercase">
            Quản Lý Lịch Hẹn
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Duyệt và theo dõi toàn bộ lịch khám của hệ thống Medicen.
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
      ) : appointments.length > 0 ? (
        <>
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {appointments.map((item) => (
                <Card
                  key={item.id}
                  className={`group relative overflow-hidden rounded-[32px] border-2 bg-white shadow-sm transition-all hover:shadow-lg ${!item.status || item.status === "scheduled" ? "border-amber-100" : "border-slate-100 hover:border-blue-100"}`}
                >
                  <CardContent className="p-6">
                    <div className="mb-6 flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-colors ${!item.status || item.status === "scheduled" ? "bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white" : "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"}`}
                        >
                          <FaStethoscope size={22} />
                        </div>
                        <div>
                          <h4 className="text-sm font-black tracking-tight text-slate-800 uppercase">
                            {getTypeLabel(item.type)}
                          </h4>
                          <p className="mt-0.5 text-[10px] font-bold text-slate-400">
                            Mã LH: #{item.id}
                          </p>
                        </div>
                      </div>
                      {renderStatusBadge(item.status)}
                    </div>

                    <div className="mb-4 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-3">
                        <p className="mb-1 flex items-center gap-1.5 text-[9px] font-black tracking-widest text-slate-400 uppercase">
                          <FaUser size={10} /> KHÁCH HÀNG
                        </p>

                        <p
                          className="truncate text-sm font-black text-slate-700"
                          title={getCustomerName(item.user_id)}
                        >
                          {getCustomerName(item.user_id)}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-3">
                        <p className="mb-1 flex items-center gap-1.5 text-[9px] font-black tracking-widest text-slate-400 uppercase">
                          <HiOutlineClock size={12} /> THỜI GIAN
                        </p>
                        <p className="text-sm font-black text-(--primaryCustom)">
                          {item.appointment_time?.substring(0, 5)} -{" "}
                          {formatToDDMMYYYY(item.appointment_date)}
                        </p>
                      </div>
                    </div>

                    <p className="mb-4 px-2 text-[10px] font-bold text-slate-400">
                      Bác sĩ:{" "}
                      <span className="text-slate-700">
                        {getDoctorName(item.doctor_id)}
                      </span>
                    </p>

                    {(!item.status || item.status === "scheduled") && (
                      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
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
                                onClick={() => handleDecline(item.id)}
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
                                {getDoctorName(item.doctor_id)}.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="h-12 cursor-pointer rounded-2xl border-none bg-slate-100 font-black uppercase">
                                Quay lại
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleConfirm(item.id)}
                                className="h-12 cursor-pointer rounded-2xl bg-(--primaryCustom)! font-black uppercase hover:opacity-90"
                              >
                                Xác nhận lịch
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </CardContent>
                </Card>
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
