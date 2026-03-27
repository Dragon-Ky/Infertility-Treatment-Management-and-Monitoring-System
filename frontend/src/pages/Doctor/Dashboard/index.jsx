import { useEffect, useState } from "react";
import api from "../../../utils/api";
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
  HiOutlineSearch,
} from "react-icons/hi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

function DoctorDashboard() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await api.get("/doctor/patients");
        if (response.data.status === "success") {
          setPatients(response.data.data);
        }
      } catch (error) {
        console.error("Lỗi lấy danh sách bệnh nhân:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  return (
    <div className="min-h-screen space-y-8 bg-slate-50/50 p-8">
      {/* Header & Stats */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Bảng Điều Khiển Bác Sĩ
          </h1>
          <p className="font-medium text-slate-500">
            Chào mừng trở lại! Hôm nay bạn có {patients.length} bệnh nhân mới.
          </p>
        </div>
        <Button className="h-12 rounded-xl bg-(--primaryCustom) font-bold hover:bg-(--primaryCustom)/90">
          <HiOutlineCalendar className="mr-2 h-5 w-5" /> Lịch hẹn hôm nay
        </Button>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="rounded-2xl border-none bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-black tracking-wider text-slate-400 uppercase">
              Tổng Bệnh Nhân
            </CardTitle>
            <HiOutlineUserGroup className="h-6 w-6 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900">
              {patients.length}
            </div>
            <p className="mt-1 text-xs font-bold text-green-500">
              +12% so với tháng trước
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-none bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-black tracking-wider text-slate-400 uppercase">
              Đang Điều Trị
            </CardTitle>
            <HiOutlineClipboardCheck className="h-6 w-6 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900">24</div>
            <p className="mt-1 text-xs font-medium text-slate-400">
              Đang theo dõi phác đồ IVF/IUI
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-none bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-black tracking-wider text-slate-400 uppercase">
              Lịch Hẹn Mới
            </CardTitle>
            <HiOutlineSearch className="h-6 w-6 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900">08</div>
            <p className="mt-1 text-xs font-bold text-purple-500">
              Cần xác nhận trong ngày
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Patients Table */}
      <Card className="overflow-hidden rounded-2xl border-none bg-white shadow-sm">
        <CardHeader className="border-b border-slate-50 p-6">
          <CardTitle className="text-xl font-black text-slate-800">
            Danh Sách Bệnh Nhân Mới
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <AiOutlineLoading3Quarters className="animate-spin text-3xl text-(--primaryCustom)" />
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="pl-6 text-xs font-black text-slate-400 uppercase">
                    Bệnh nhân
                  </TableHead>
                  <TableHead className="text-xs font-black text-slate-400 uppercase">
                    Liên lạc
                  </TableHead>
                  <TableHead className="text-xs font-black text-slate-400 uppercase">
                    Ngày đăng ký
                  </TableHead>
                  <TableHead className="text-xs font-black text-slate-400 uppercase">
                    Trạng thái
                  </TableHead>
                  <TableHead className="pr-6 text-right text-xs font-black text-slate-400 uppercase">
                    Thao tác
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((patient) => (
                  <TableRow
                    key={patient.id}
                    className="transition-colors hover:bg-slate-50/50"
                  >
                    <TableCell className="py-4 pl-6">
                      <div className="font-bold text-slate-900">
                        {patient.name}
                      </div>
                      <div className="text-xs text-slate-400">
                        {patient.email}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-slate-600">
                      {patient.phone}
                    </TableCell>
                    <TableCell className="text-sm text-slate-500">
                      {new Date(patient.created_at).toLocaleDateString("vi-VN")}
                    </TableCell>
                    <TableCell>
                      <Badge className="rounded-lg border-blue-100 bg-blue-50 px-3 py-1 font-bold text-blue-600 hover:bg-blue-100">
                        Mới Đăng Ký
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <Button
                        variant="outline"
                        className="rounded-lg border-slate-200 text-xs font-bold hover:bg-slate-100"
                      >
                        Lập Bệnh Án
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default DoctorDashboard;
