import { useEffect, useState } from "react";
import { getAllProtocols, deleteProtocol } from "@/services/protocolService";
import { getCustomers } from "@/services/doctorService";

import {
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlineDotsVertical,
  HiOutlineClipboardList,
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
import AddProtocolModal from "@/components/AddProtocolModal";
import DeleteConfirm from "@/components/DeleteConfirm";

function ProtocolManagement() {
  const [protocols, setProtocols] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const formatDateDisplay = (dateString) => {
    if (!dateString) return "---";
    return dateString.substring(0, 10);
  };

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [protocolRes, customerRes] = await Promise.all([
        getAllProtocols(),
        getCustomers(),
      ]);

      const mappedUsers = {};
      if (customerRes && customerRes.data) {
        customerRes.data.forEach((user) => {
          if (user.id) mappedUsers[String(user.id)] = user.name;
        });
      }
      setUsersMap(mappedUsers);

      if (protocolRes && protocolRes.data) {
        setProtocols(protocolRes.data);
      }
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error("Lỗi đồng bộ dữ liệu!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProtocol(id);
      toast.success(`Đã xóa phác đồ thành công!`);
      loadInitialData();
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error("Không thể xóa dữ liệu này!");
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  return (
    <div className="animate-in fade-in min-h-screen space-y-6 bg-slate-50 p-6 duration-500">
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

        <AddProtocolModal onAdded={loadInitialData} triggerType="menuItem" />
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
            className="h-12 rounded-2xl border-slate-200 px-6 font-bold text-slate-600 shadow-sm"
          >
            <HiOutlineFilter size={20} className="mr-2" /> LỌC DỮ LIỆU
          </Button>
        </CardContent>
      </Card>

      {/* Table Section */}
      <Card className="overflow-hidden rounded-[32px] border-none bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="border-b border-slate-100">
              <TableHead className="p-6 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                Mã Phác Đồ
              </TableHead>
              <TableHead className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                Khách Hàng
              </TableHead>
              <TableHead className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                Nội Dung
              </TableHead>
              <TableHead className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                Thời Gian
              </TableHead>
              <TableHead className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
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
            ) : (
              protocols
                .filter(
                  (p) =>
                    (usersMap[String(p.treatment_id)] || "")
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    (p.protocol_code || "")
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()),
                )
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
                      {protocol.protocol_code || `#${protocol.id}`}
                    </TableCell>
                    <TableCell>
                      <div
                        className="flex cursor-pointer items-center gap-4"
                        onClick={() =>
                          navigate(`/doctor/protocols/details/${protocol.id}`)
                        }
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 font-black text-blue-600 italic transition-colors group-hover:bg-blue-100">
                          {usersMap[String(protocol.treatment_id)]?.[0] || "U"}
                        </div>
                        <span className="text-sm font-black text-slate-800 uppercase hover:text-(--primaryCustom)">
                          {usersMap[String(protocol.treatment_id)] ||
                            `Bệnh nhân #${protocol.treatment_id}`}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-blue-600">
                          {protocol.protocol_name}
                        </span>
                        <span className="line-clamp-1 text-xs text-slate-400 italic">
                          {protocol.diagnosis}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-[11px] font-bold text-slate-500">
                      {formatDateDisplay(protocol.created_at)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`rounded-lg border px-3 py-1 text-[10px] font-black ${protocol.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                      >
                        {protocol.is_active ? "ĐANG CHẠY" : "DỪNG"}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <DeleteConfirm
                          description={`phác đồ ${protocol.protocol_code || protocol.id}`}
                          onConfirm={() => handleDelete(protocol.id)}
                        />

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-10 w-10 rounded-xl p-0 text-slate-400 hover:bg-slate-100"
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

                            <AddProtocolModal
                              editData={protocol}
                              onAdded={loadInitialData}
                              triggerType="menuItem"
                            />

                            <DropdownMenuItem className="focus:bg-primary cursor-pointer rounded-xl p-3">
                              In đơn thuốc
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
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
