import { useState, useEffect } from "react";
import {
  HiOutlineCalendar,
  HiPlus,
  HiOutlineClock,
  HiViewGrid,
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
import {
  getAllAppointments,
  cancelAppointment,
} from "@/services/appointmentService";
import { getDoctors } from "@/services/managerService";

function CustomerAppointments() {
  const [appointments, setAppointments] = useState([]);
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
      const [appRes, docRes] = await Promise.all([
        getAllAppointments(),
        getDoctors(),
      ]);

      const rawAppointments = appRes?.data ? appRes.data : appRes;
      const appointmentsArray = Array.isArray(rawAppointments)
        ? rawAppointments
        : [];

      const sortedData = [...appointmentsArray].sort(
        (a, b) => new Date(b.appointment_date) - new Date(a.appointment_date),
      );
      setAppointments(sortedData);

      const rawDoctors = docRes?.data ? docRes.data : docRes;
      setDoctors(Array.isArray(rawDoctors) ? rawDoctors : []);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // xử lí hủy lịch
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
    };
    return types[type] || "Khám bệnh";
  };

  const getDoctorName = (doctorId) => {
    if (!doctors || doctors.length === 0) return `Bác sĩ ID: ${doctorId}`;
    const doc = doctors.find((d) => d.id.toString() === doctorId.toString());
    return doc ? doc.name : `Bác sĩ ID: ${doctorId}`;
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

  // Map dữ liệu Lịch Hẹn sang chuẩn của FullCalendar
  const calendarEvents = appointments.map((app) => {
    let bgColor = "#f59e0b"; // Vàng: Chờ xác nhận
    if (app.status === "confirmed") bgColor = "#22c55e";
    if (app.status === "cancelled") bgColor = "#ef4444";
    if (app.status === "completed") bgColor = "#64748b";

    return {
      id: app.id,
      title: `${getTypeLabel(app.type)} - ${getDoctorName(app.doctor_id)}`,
      date: app.appointment_date.substring(0, 10), // Giữ lại đúng format YYYY-MM-DD cho Calendar
      backgroundColor: bgColor,
      borderColor: "transparent",
    };
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-2xl font-black tracking-tighter text-slate-800 uppercase">
            Lịch Hẹn Của Tôi
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Quản lý và theo dõi lịch khám bệnh, siêu âm, xét nghiệm của bạn.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-2xl bg-slate-100 p-1 shadow-inner">
            <button
              onClick={() => setViewMode("grid")}
              className={`flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-[10px] font-black tracking-widest uppercase transition-all ${viewMode === "grid" ? "bg-white text-(--primaryCustom) shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
            >
              <HiViewGrid size={16} /> Dạng thẻ
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
            <HiPlus className="mr-2" size={16} /> ĐẶT LỊCH MỚI
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
          ) : appointments.length > 0 ? (
            <>
              {/* Dạng Gird */}
              {viewMode === "grid" && (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {appointments.map((item) => (
                    <div
                      key={item.id}
                      className="group relative flex flex-col overflow-hidden rounded-[32px] border-2 border-slate-100 bg-white p-6 shadow-sm transition-all hover:border-blue-100 hover:shadow-md"
                    >
                      <div className="mb-6 flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
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

                      <div className="mb-4 rounded-2xl bg-slate-50 p-4">
                        <p className="mb-1 text-[9px] font-black tracking-widest text-slate-400 uppercase">
                          Bác sĩ phụ trách
                        </p>
                        <div className="flex items-center gap-2">
                          <FaUserMd className="text-slate-400" />
                          <p className="text-sm font-black text-slate-800 uppercase">
                            {getDoctorName(item.doctor_id)}
                          </p>
                        </div>
                      </div>

                      <div className="mb-4 grid grid-cols-2 gap-3">
                        <div className="rounded-2xl border border-slate-100 p-3">
                          <p className="mb-1 flex items-center gap-1.5 text-[9px] font-black tracking-widest text-slate-400 uppercase">
                            <HiOutlineCalendar size={12} /> NGÀY KHÁM
                          </p>
                          <p className="text-sm font-black text-(--primaryCustom)">
                            {formatToDDMMYYYY(item.appointment_date)}
                          </p>
                        </div>
                        <div className="rounded-2xl border border-slate-100 p-3">
                          <p className="mb-1 flex items-center gap-1.5 text-[9px] font-black tracking-widest text-slate-400 uppercase">
                            <HiOutlineClock size={12} /> GIỜ DỰ KIẾN
                          </p>
                          <p className="text-sm font-black text-amber-600">
                            {item.appointment_time?.substring(0, 5)}
                          </p>
                        </div>
                      </div>

                      {item.notes && (
                        <div className="mb-4 rounded-xl border border-slate-100 bg-slate-50/50 p-3 text-xs font-medium text-slate-500 italic">
                          "{item.notes}"
                        </div>
                      )}

                      <div className="mt-auto pt-2">
                        {(!item.status || item.status === "scheduled") && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                className="h-10 w-full cursor-pointer rounded-xl border-red-200 text-[10px] font-black tracking-widest text-red-500 uppercase transition-colors hover:bg-red-50 hover:text-red-600 active:scale-95"
                              >
                                Hủy lịch hẹn
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="z-[10001] rounded-[32px] border-none p-8 shadow-2xl sm:max-w-[450px]">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-xl font-black tracking-tighter text-slate-800 uppercase">
                                  Xác nhận hủy lịch?
                                </AlertDialogTitle>
                                <AlertDialogDescription className="font-bold text-slate-400 italic">
                                  "Hành động này sẽ hủy lịch hẹn{" "}
                                  <strong>{getTypeLabel(item.type)}</strong> của
                                  bạn. Bác sĩ phụ trách sẽ nhận được thông báo
                                  về việc hủy này."
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter className="mt-6 gap-3">
                                <AlertDialogCancel className="h-12 cursor-pointer rounded-2xl border-none bg-slate-100 font-black tracking-widest text-slate-500 uppercase hover:bg-slate-200">
                                  Quay lại
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleCancelAppointment(item.id)
                                  }
                                  className="h-12 cursor-pointer rounded-2xl bg-red-500 font-black tracking-widest text-white uppercase shadow-lg shadow-red-100 hover:bg-red-600"
                                >
                                  Đồng ý hủy
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Dạng lịch tháng (calendar) */}
              {viewMode === "calendar" && (
                <div className="rounded-[32px] bg-white p-6 shadow-sm">
                  <style>{`
                    .fc .fc-toolbar-title { font-size: 1.25rem; font-weight: 900; text-transform: uppercase; color: #1e293b; }
                    .fc .fc-button-primary { background-color: var(--primaryCustom); border: none; border-radius: 12px; text-transform: uppercase; font-size: 10px; font-weight: 900; letter-spacing: 0.1em; }
                    .fc .fc-button-primary:hover { background-color: #2563eb; }
                    .fc .fc-daygrid-event { border-radius: 6px; padding: 2px 4px; font-size: 10px; font-weight: 700; cursor: pointer; transition: transform 0.1s;}
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
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-[32px] bg-white py-24 text-center">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-50 text-(--primaryCustom)">
                <HiOutlineCalendar className="text-5xl" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-slate-700">
                Bạn chưa có lịch hẹn nào
              </h3>
              <p className="mb-8 max-w-md text-slate-500">
                Hồ sơ sức khỏe của bạn hiện chưa ghi nhận lịch khám hoặc điều
                trị nào. Hãy đặt lịch để bắt đầu lộ trình IVF nhé!
              </p>
              <Button
                onClick={() => setIsOpenModal(true)}
                variant="outline"
                className="h-12 cursor-pointer rounded-2xl border-2 border-(--primaryCustom) px-6 text-[10px] font-black tracking-widest text-(--primaryCustom) uppercase transition-all hover:bg-blue-50 active:scale-95"
              >
                <HiOutlineClock className="mr-2" size={16} /> ĐẶT LỊCH NGAY
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default CustomerAppointments;
