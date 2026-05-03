import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  HiOutlineUserGroup,
  HiOutlineClipboardCheck,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineChartSquareBar,
} from "react-icons/hi";
import { TbBabyCarriage } from "react-icons/tb";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import toast from "react-hot-toast";

import { getAllProtocols } from "@/services/protocolService";
import { getCustomers, getTreatmentDashboard } from "@/services/doctorService";
import { getAllAppointments } from "@/services/appointmentService";

function DoctorDashboard() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [protocols, setProtocols] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      const [customersRes, statsRes, protocolsRes, appsRes] = await Promise.all(
        [
          getCustomers(),
          getTreatmentDashboard(),
          getAllProtocols(),
          getAllAppointments(),
        ],
      );

      if (customersRes.status === "success") {
        setPatients(customersRes.data || []);
      }

      setStats(statsRes.data || statsRes || {});
      setProtocols(protocolsRes?.data || protocolsRes || []);

      const rawApps = appsRes?.data ? appsRes.data : appsRes;
      setAppointments(Array.isArray(rawApps) ? rawApps : []);
    } catch (error) {
      console.error("Lỗi tải Dashboard:", error);
      toast.error("Không thể tải toàn bộ dữ liệu hệ thống!");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const getLocalTodayString = () => {
    const today = new Date();
    return (
      today.getFullYear() +
      "-" +
      String(today.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(today.getDate()).padStart(2, "0")
    );
  };

  const getTodayAppointmentsCount = () => {
    const todayStr = getLocalTodayString();
    return appointments.filter(
      (app) =>
        app.appointment_date?.startsWith(todayStr) &&
        app.status === "confirmed",
    ).length;
  };

  const getUpcomingAppointment = (userId) => {
    const todayStr = getLocalTodayString();
    const upcoming = appointments
      .filter(
        (app) =>
          String(app.user_id) === String(userId) &&
          app.status === "confirmed" &&
          app.appointment_date?.substring(0, 10) >= todayStr,
      )
      .sort(
        (a, b) => new Date(a.appointment_date) - new Date(b.appointment_date),
      );

    return upcoming.length > 0 ? upcoming[0] : null;
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

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50">
        <AiOutlineLoading3Quarters className="animate-spin text-5xl text-(--primaryCustom)" />
        <p className="animate-pulse text-[12px] font-black tracking-widest text-slate-400 uppercase">
          Đang đồng bộ dữ liệu Microservices...
        </p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in zoom-in-95 min-h-screen space-y-8 bg-slate-50/50 p-8 duration-500">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Tổng quan Điều trị (IVF/IUI)
          </h1>
          <p className="mt-1 font-medium text-slate-500">
            Hôm nay hệ thống ghi nhận{" "}
            <span className="font-bold text-(--primaryCustom)">
              {patients.length}
            </span>{" "}
            bệnh nhân đăng ký.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="h-12 cursor-pointer rounded-2xl border-2 border-(--primaryCustom) bg-white px-6 font-black tracking-widest text-(--primaryCustom) uppercase shadow-sm transition-all hover:-translate-y-1 hover:bg-slate-50 hover:text-(--primaryCustom)"
            onClick={() => navigate(`/doctor/protocols`)}
          >
            <HiOutlineClipboardCheck className="mr-2 h-5 w-5" /> Quản lý Phác đồ
          </Button>

          <Button
            className="h-12 cursor-pointer rounded-2xl bg-(--primaryCustom) px-6 font-black tracking-widest text-white uppercase shadow-lg shadow-blue-200 transition-all hover:-translate-y-1 hover:opacity-90"
            onClick={() => navigate(`/doctor/appointments`)}
          >
            <HiOutlineCalendar className="mr-2 h-5 w-5" /> Quản lý Lịch hẹn
          </Button>

          <Button
            variant="outline"
            className="h-12 cursor-pointer rounded-2xl border-2 border-slate-900 bg-white px-6 font-black tracking-widest text-slate-900 uppercase shadow-sm transition-all hover:-translate-y-1 hover:bg-slate-50"
            onClick={() => navigate(`/doctor/my-blog`)}
          >
            <HiOutlineChartSquareBar className="mr-2 h-5 w-5" /> Blog cá nhân
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="group rounded-[24px] border-none bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-100/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Tổng Bệnh Nhân
            </CardTitle>
            <div className="rounded-xl bg-blue-50 p-3 text-blue-500 transition-colors group-hover:bg-blue-500 group-hover:text-white">
              <HiOutlineUserGroup className="h-6 w-6" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-slate-800">
              {patients.length}
            </div>
            <p className="mt-2 text-[11px] font-bold tracking-wide text-green-500 uppercase">
              Hồ sơ trên hệ thống
            </p>
          </CardContent>
        </Card>

        <Card className="group rounded-[24px] border-none bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-100/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Ca Đang Điều Trị
            </CardTitle>
            <div className="rounded-xl bg-amber-50 p-3 text-amber-500 transition-colors group-hover:bg-amber-500 group-hover:text-white">
              <HiOutlineClipboardCheck className="h-6 w-6" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-slate-800">
              {stats?.active_treatments || 0}
            </div>
            <p className="mt-2 text-[11px] font-bold tracking-wide text-slate-400 uppercase">
              Phác đồ IVF/IUI Active
            </p>
          </CardContent>
        </Card>

        <Card className="group rounded-[24px] border-none bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-100/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Lịch Hẹn Hôm Nay
            </CardTitle>
            <div className="rounded-xl bg-purple-50 p-3 text-purple-500 transition-colors group-hover:bg-purple-500 group-hover:text-white">
              <HiOutlineCalendar className="h-6 w-6" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-slate-800">
              {getTodayAppointmentsCount()}
            </div>
            <p className="mt-2 text-[11px] font-bold tracking-wide text-purple-500 uppercase">
              Ca hẹn siêu âm / tiêm
            </p>
          </CardContent>
        </Card>

        <Card className="group rounded-[24px] border-none bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-100/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Ca Đậu Thai Mới
            </CardTitle>
            <div className="rounded-xl bg-pink-50 p-3 text-pink-500 transition-colors group-hover:bg-pink-500 group-hover:text-white">
              <TbBabyCarriage className="h-6 w-6" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-slate-800">
              {stats?.successful_pregnancies || 0}
            </div>
            <p className="mt-2 text-[11px] font-bold tracking-wide text-pink-500 uppercase">
              Ghi nhận mới nhất
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden rounded-[32px] border-none bg-white shadow-sm">
        <CardHeader className="border-b border-slate-50 p-6 px-8">
          <CardTitle className="text-xl font-black tracking-tighter text-slate-800 uppercase">
            Danh Sách Bệnh Nhân
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="py-4 pl-8 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  Bệnh nhân
                </TableHead>
                <TableHead className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  Ngày tiếp nhận
                </TableHead>
                <TableHead className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  Trạng thái
                </TableHead>
                <TableHead className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  Lịch hẹn tiếp theo
                </TableHead>
                <TableHead className="pr-8 text-right text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  Thao tác
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((patient) => {
                const patientProtocol = protocols.find(
                  (p) =>
                    String(p.user_id) === String(patient.id) ||
                    String(p.treatment_id) === String(patient.id),
                );
                const hasProtocol = !!patientProtocol;
                const isCompleted = patientProtocol?.status === "completed";
                const upcomingApp = getUpcomingAppointment(patient.id);

                return (
                  <TableRow
                    key={patient.id}
                    className={`group cursor-pointer border-b border-slate-50 transition-colors hover:bg-slate-50`}
                    onClick={() => {
                      if (hasProtocol)
                        navigate(
                          `/doctor/protocols/details/${patientProtocol.id}`,
                        );
                      else navigate(`/doctor/protocols`);
                    }}
                  >
                    <TableCell className="py-5 pl-8">
                      <div
                        className={`font-black text-slate-800 transition-colors group-hover:text-(--primaryCustom)`}
                      >
                        {patient.name}
                      </div>
                      <div className="text-[11px] font-bold text-slate-400">
                        {patient.phone || "Chưa cập nhật SĐT"}
                      </div>
                    </TableCell>

                    <TableCell className="text-xs font-bold text-slate-500">
                      {patient.created_at
                        ? new Date(patient.created_at).toLocaleDateString(
                            "vi-VN",
                          )
                        : "Chưa rõ"}
                    </TableCell>

                    <TableCell>
                      {hasProtocol ? (
                        isCompleted ? (
                          <Badge className="rounded-xl border-none bg-purple-100 px-3 py-1 text-[10px] font-black text-purple-700 shadow-none">
                            ĐÃ HOÀN THÀNH
                          </Badge>
                        ) : (
                          <Badge className="rounded-xl border-none bg-green-100 px-3 py-1 text-[10px] font-black text-green-700 shadow-none">
                            ĐANG ĐIỀU TRỊ
                          </Badge>
                        )
                      ) : (
                        <Badge className="rounded-lg border-none bg-amber-50 px-3 py-1 text-[10px] font-black text-amber-600 uppercase shadow-none">
                          CHỜ LẬP BỆNH ÁN
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell>
                      {upcomingApp ? (
                        <div>
                          <p className="flex items-center gap-1 text-sm font-black text-(--primaryCustom)">
                            <HiOutlineClock size={14} />{" "}
                            {upcomingApp.appointment_time?.substring(0, 5)}
                          </p>
                          <p className="mt-0.5 text-[11px] font-bold text-slate-500">
                            {new Date(
                              upcomingApp.appointment_date,
                            ).toLocaleDateString("vi-VN")}{" "}
                            - {getTypeLabel(upcomingApp.type)}
                          </p>
                        </div>
                      ) : (
                        <span className="text-[11px] font-bold text-slate-300 italic">
                          Không có lịch hẹn
                        </span>
                      )}
                    </TableCell>

                    <TableCell className="pr-8 text-right">
                      <Button
                        variant="outline"
                        className={`cursor-pointer rounded-xl text-[10px] font-black tracking-widest uppercase transition-colors ${
                          hasProtocol
                            ? "border-slate-200 text-slate-600 hover:border-(--primaryCustom) hover:bg-(--primaryCustom) hover:text-white"
                            : "border-(--primaryCustom) bg-(--primaryCustom) text-white hover:opacity-90"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (hasProtocol)
                            navigate(
                              `/doctor/protocols/details/${patientProtocol.id}`,
                            );
                          else navigate(`/doctor/protocols`);
                        }}
                      >
                        {hasProtocol ? "Xem Hồ Sơ" : "Lập Bệnh Án"}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {patients.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-20 text-center font-black tracking-widest text-slate-300 uppercase italic"
                  >
                    Không có dữ liệu bệnh nhân
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default DoctorDashboard;
