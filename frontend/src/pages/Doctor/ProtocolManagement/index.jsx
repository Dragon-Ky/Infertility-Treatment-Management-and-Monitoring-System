import React, { useEffect, useState } from "react";
import { getAllProtocols } from "@/services/protocolService";
import { getCustomers } from "@/services/doctorService";

import {
  HiOutlinePlus,
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlineDotsVertical,
  HiOutlineClipboardList,
  HiOutlineCalendar,
  HiOutlineUser,
} from "react-icons/hi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function ProtocolManagement() {
  const [protocols, setProtocols] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const [protocolRes, customerRes] = await Promise.all([
          getAllProtocols(),
          getCustomers(),
        ]);

        //MAPPING TÊN BỆNH NHÂN (Auth Service)
        const mappedUsers = {};
        if (customerRes && customerRes.data) {
          customerRes.data.forEach((user) => {
            if (user.id) {
              mappedUsers[String(user.id)] = user.name;
            }
          });
        }
        setUsersMap(mappedUsers);

        //DANH SÁCH PHÁC ĐỒ (TREATMENT-SERVICE)
        if (protocolRes && protocolRes.data) {
          setProtocols(protocolRes.data);
        }
      } catch (error) {
        toast.error("Lỗi đồng bộ dữ liệu giữa Auth và Treatment Service!");
        console.error("Chi tiết lỗi:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-6">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-black tracking-tighter text-slate-900 uppercase">
            <div className="rounded-2xl bg-blue-600 p-2 shadow-lg shadow-blue-200">
              <HiOutlineClipboardList className="text-white" size={28} />
            </div>
            Quản lý Phác đồ
          </h1>
          <p className="mt-1 font-medium text-slate-500">
            Hệ thống điều trị vô sinh Medicen Clinic
          </p>
        </div>
        <Button className="h-14 rounded-2xl bg-slate-900 px-8 font-black text-white shadow-xl transition-all hover:bg-slate-800 active:scale-95">
          <HiOutlinePlus size={20} className="mr-2" />
          TẠO PHÁC ĐỒ MỚI
        </Button>
      </div>

      {/* Filter Bar */}
      <Card className="rounded-[24px] border-none bg-white shadow-sm">
        <CardContent className="flex gap-4 p-4">
          <div className="relative flex-1">
            <HiOutlineSearch
              className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400"
              size={20}
            />
            <Input
              placeholder="Tìm tên bệnh nhân hoặc mã điều trị..."
              className="h-12 rounded-2xl border-none bg-slate-50 pl-12 text-base focus-visible:ring-2 focus-visible:ring-blue-500"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            className="h-12 rounded-2xl border-slate-200 px-6 font-bold text-slate-600"
          >
            <HiOutlineFilter size={20} className="mr-2" /> LỌC DỮ LIỆU
          </Button>
        </CardContent>
      </Card>

      {/* Table Section */}
      <Card className="overflow-hidden rounded-[32px] border-none bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="border-b border-slate-100 hover:bg-transparent">
              <TableHead className="p-6 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                Mã Phác Đồ
              </TableHead>
              <TableHead className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                Bệnh Nhân
              </TableHead>
              <TableHead className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                Nội Dung Điều Trị
              </TableHead>
              <TableHead className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                Thời Gian
              </TableHead>
              <TableHead className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                Trạng Thái
              </TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="py-32 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                    <span className="font-black tracking-widest text-slate-300 uppercase italic">
                      Đang kết nối Microservices...
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : protocols.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-20 text-center font-bold text-slate-400 uppercase italic"
                >
                  Không tìm thấy dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              protocols
                .filter((p) => {
                  const patientName = usersMap[String(p.treatment_id)] || "";
                  return (
                    patientName
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    p.treatment_id.toString().includes(searchTerm)
                  );
                })
                .map((protocol) => (
                  <TableRow
                    key={protocol.id}
                    className="group border-b border-slate-50 transition-all hover:bg-blue-50/20"
                  >
                    <TableCell
                      className="cursor-pointer p-6 font-bold text-slate-400 hover:text-(--primaryCustom)"
                      onClick={() =>
                        navigate(`/doctor/protocols/details/${protocol.id}`)
                      }
                    >
                      #{protocol.id}
                    </TableCell>
                    <TableCell>
                      <div
                        className="flex cursor-pointer items-center gap-4"
                        onClick={() =>
                          navigate(`/doctor/protocols/details/${protocol.id}`)
                        }
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-blue-600 transition-colors group-hover:bg-blue-100">
                          <HiOutlineUser size={24} />
                        </div>
                        <div className="flex flex-col">
                          <span className="mb-1 text-sm leading-none font-black text-slate-800 uppercase">
                            {usersMap[String(protocol.treatment_id)] ||
                              `Bệnh nhân #${protocol.treatment_id}`}
                          </span>
                          <span className="w-fit rounded-full bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-slate-400">
                            ID Auth: {protocol.treatment_id}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="mb-1 text-sm font-black text-blue-600">
                          {protocol.protocol_name}
                        </span>
                        <span className="line-clamp-1 text-xs text-slate-500 italic">
                          {protocol.diagnosis}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-[11px] font-bold text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <HiOutlineCalendar
                          className="text-slate-300"
                          size={16}
                        />
                        {protocol.created_at}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`rounded-lg border px-3 py-1 text-[10px] font-black shadow-none ${protocol.is_active ? "border-green-200 bg-green-100 text-green-700" : "border-red-200 bg-red-100 text-red-700"}`}
                      >
                        {protocol.is_active ? "ĐANG CHẠY" : "KẾT THÚC"}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-10 w-10 rounded-xl p-0 hover:bg-slate-100"
                          >
                            <HiOutlineDotsVertical />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="min-w-[180px] rounded-2xl border-none p-2 font-bold shadow-2xl"
                        >
                          <DropdownMenuItem
                            className="cursor-pointer rounded-xl p-3 text-blue-600 focus:bg-(--primaryCustom)"
                            onClick={() =>
                              navigate(
                                `/doctor/protocols/details/${protocol.id}`,
                              )
                            }
                          >
                            Chi tiết phác đồ
                          </DropdownMenuItem>
                          <DropdownMenuItem className="focus:bg-primary cursor-pointer rounded-xl p-3">
                            In đơn thuốc
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer rounded-xl p-3 text-red-600 focus:bg-(--dangerCustom)">
                            Xóa dữ liệu
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

export default ProtocolManagement;
