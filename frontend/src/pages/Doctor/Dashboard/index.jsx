import { useEffect, useState } from "react";
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
} from "react-icons/hi";
import { TbBabyCarriage } from "react-icons/tb";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { getAllProtocols } from "@/services/protocolService";
import toast from "react-hot-toast";
import { getCustomers, getTreatmentDashboard } from "@/services/doctorService";

function DoctorDashboard() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [protocols, setProtocols] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Gọi 3 Api để đồng bộ
        const [customersRes, statsRes, protocolsRes] = await Promise.all([
          getCustomers(),
          getTreatmentDashboard(),
          getAllProtocols(),
        ]);

        if (customersRes.status === "success") {
          setPatients(customersRes.data || []);
        }

        setStats(statsRes.data || statsRes || {});
        setProtocols(protocolsRes?.data || protocolsRes || []);
      } catch (error) {
        console.error("Lỗi tải Dashboard:", error);
        toast.error("Không thể tải toàn bộ dữ liệu hệ thống!");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50">
        <AiOutlineLoading3Quarters className="animate-spin text-5xl text-blue-600" />
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
            <span className="font-bold text-blue-600">{patients.length}</span>{" "}
            bệnh nhân đăng ký.
          </p>
        </div>
        <Button
          className="h-12 cursor-pointer rounded-2xl bg-blue-600 px-6 font-black tracking-widest shadow-lg shadow-blue-200 transition-all hover:-translate-y-1 hover:bg-blue-700"
          onClick={() => {
            navigate(`/doctor/protocols`);
          }}
        >
          <HiOutlineCalendar className="mr-2 h-5 w-5" /> Quản lí phác đồ
        </Button>
      </div>

      {/* STATS GRID */}
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
              Lịch Thuốc / Tiêm
            </CardTitle>
            <div className="rounded-xl bg-purple-50 p-3 text-purple-500 transition-colors group-hover:bg-purple-500 group-hover:text-white">
              <HiOutlineCalendar className="h-6 w-6" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-slate-800">
              {stats?.today_schedules || 0}
            </div>
            <p className="mt-2 text-[11px] font-bold tracking-wide text-purple-500 uppercase">
              Cần xác nhận trong ngày
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

      {/* PATIENT TABLE */}
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
                  Liên lạc
                </TableHead>
                <TableHead className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  Ngày tiếp nhận
                </TableHead>
                <TableHead className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  Trạng thái
                </TableHead>
                <TableHead className="pr-8 text-right text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  Thao tác
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((patient) => {
                //Tìm bệnh nhân này có phác đồ bên treatment chưa
                const patientProtocol = protocols.find(
                  (p) => p.treatment_id === patient.id,
                );
                const hasProtocol = !!patientProtocol; // true nếu tìm thấy, false nếu ko có

                return (
                  <TableRow
                    key={patient.id}
                    className={`group cursor-pointer border-b border-slate-50 transition-colors ${
                      hasProtocol
                        ? "hover:bg-blue-50/30"
                        : "hover:bg-amber-50/30"
                    }`}
                    onClick={() => {
                      if (hasProtocol) {
                        // Nếu có phác đồ -> Chuyển sang chi tiết
                        navigate(
                          `/doctor/protocols/details/${patientProtocol.id}`,
                        );
                      } else {
                        // Chưa có -> Chuyển sang danh sách để lập mới
                        navigate(`/doctor/protocols`);
                      }
                    }}
                  >
                    <TableCell className="py-5 pl-8">
                      <div
                        className={`font-black transition-colors ${hasProtocol ? "text-slate-800 group-hover:text-blue-600" : "text-slate-800 group-hover:text-amber-600"}`}
                      >
                        {patient.name}
                      </div>
                      <div className="text-[11px] font-bold text-slate-400">
                        {patient.email}
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-slate-600">
                      {patient.phone || "Chưa cập nhật"}
                    </TableCell>
                    <TableCell className="text-xs font-bold text-slate-500">
                      {new Date(patient.created_at).toLocaleDateString("vi-VN")}
                    </TableCell>
                    <TableCell>
                      {hasProtocol ? (
                        <Badge className="rounded-xl border-none bg-green-100 px-3 py-1 text-[10px] font-black text-green-700">
                          ĐANG ĐIỀU TRỊ
                        </Badge>
                      ) : (
                        <Badge className="rounded-lg border-none bg-amber-50 px-3 py-1 text-[10px] font-black text-amber-600 uppercase shadow-none">
                          MỚI ĐĂNG KÝ
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="pr-8 text-right">
                      <Button
                        variant="outline"
                        className={`cursor-pointer rounded-xl text-[10px] font-black tracking-widest uppercase transition-colors ${
                          hasProtocol
                            ? "border-slate-200 text-slate-600 hover:border-blue-600 hover:bg-blue-600 hover:text-white"
                            : "border-amber-200 text-amber-600 hover:border-amber-600 hover:bg-amber-600 hover:text-white"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (hasProtocol) {
                            navigate(
                              `/doctor/protocols/details/${patientProtocol.id}`,
                            );
                          } else {
                            navigate(`/doctor/protocols`);
                          }
                        }}
                      >
                        {hasProtocol ? "Hồ Sơ Bệnh Án" : "Lập Bệnh Án"}
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
