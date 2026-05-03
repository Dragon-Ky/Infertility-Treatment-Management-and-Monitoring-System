import { useEffect, useState, useCallback } from "react";
import {
  HiOutlineRefresh,
  HiOutlineDatabase,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineClock,
  HiOutlineCloudUpload,
} from "react-icons/hi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import toast from "react-hot-toast";
import { getSyncStatus, triggerSyncData } from "@/services/reportService";

const SERVICES_TO_SYNC = [
  {
    id: "treatment",
    name: "Treatment Service",
    color: "text-blue-500",
    bg: "bg-blue-50",
    btn: "bg-blue-600 hover:bg-blue-700",
  },
  {
    id: "appointment",
    name: "Appointment Service",
    color: "text-purple-500",
    bg: "bg-purple-50",
    btn: "bg-purple-600 hover:bg-purple-700",
  },
  {
    id: "auth",
    name: "Auth (User) Service",
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    btn: "bg-emerald-600 hover:bg-emerald-700",
  },
];

function SyncDashboard() {
  const [logs, setLogs] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [syncingService, setSyncingService] = useState(null);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await getSyncStatus();
      if (res.success) {
        setLogs(res.data.logs.data || []);
        setSummary(res.data.summary || {});
      }
    } catch (error) {
      console.error("Lỗi lấy trạng thái:", error);
      toast.error("Không thể kết nối đến ETL Engine!");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const handleTriggerSync = async (serviceId, serviceName) => {
    try {
      setSyncingService(serviceId);
      toast.loading(`Đang đồng bộ dữ liệu từ ${serviceName}...`, {
        id: "sync",
      });

      const res = await triggerSyncData(serviceId, "full_sync");

      if (res.success) {
        toast.success(
          `Đồng bộ xong! Đã tải về ${res.data.records_synced} bản ghi.`,
          { id: "sync" },
        );
        fetchStatus();
      } else {
        toast.error("Quá trình đồng bộ thất bại!", { id: "sync" });
      }
    } catch (error) {
      toast.error("Lỗi mất kết nối với máy chủ NiFi!", { id: "sync" });
    } finally {
      setSyncingService(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50">
        <AiOutlineLoading3Quarters className="animate-spin text-5xl text-blue-600" />
        <p className="animate-pulse text-[12px] font-black tracking-widest text-slate-400 uppercase">
          Khởi động ETL Engine...
        </p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in zoom-in-95 min-h-screen space-y-8 bg-slate-50/50 p-8 duration-500">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Hệ Thống Đồng Bộ (ETL Sync)
          </h1>
          <p className="mt-1 font-medium text-slate-500">
            Quản lý và kích hoạt tiến trình luân chuyển dữ liệu từ các
            Microservices.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-white px-4 py-2 shadow-sm">
          <div className="h-3 w-3 animate-pulse rounded-full bg-green-500"></div>
          <span className="text-xs font-black tracking-widest text-slate-600 uppercase">
            NiFi Engine: Online
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-[24px] border-none bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Tổng Lần Chạy
            </CardTitle>
            <div className="rounded-xl bg-slate-100 p-3 text-slate-500">
              <HiOutlineRefresh className="h-6 w-6" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-800">
              {summary.total_syncs || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[24px] border-none bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Thành Công
            </CardTitle>
            <div className="rounded-xl bg-green-50 p-3 text-green-500">
              <HiOutlineCheckCircle className="h-6 w-6" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-800">
              {summary.successful_syncs || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[24px] border-none bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Thất Bại
            </CardTitle>
            <div className="rounded-xl bg-red-50 p-3 text-red-500">
              <HiOutlineXCircle className="h-6 w-6" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-800">
              {summary.failed_syncs || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[24px] border-none bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Lần Chạy Gần Nhất
            </CardTitle>
            <div className="rounded-xl bg-amber-50 p-3 text-amber-500">
              <HiOutlineClock className="h-6 w-6" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="mt-2 text-sm font-black text-slate-800">
              {summary.last_sync?.synced_at
                ? new Date(summary.last_sync.synced_at).toLocaleString("vi-VN")
                : "Chưa có dữ liệu"}
            </div>
            <p className="mt-1 text-[10px] font-bold text-slate-400 uppercase">
              Nguồn: {summary.last_sync?.source_service || "---"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="rounded-[32px] border-none bg-white p-6 shadow-sm lg:col-span-1">
          <h3 className="mb-6 flex items-center gap-2 text-lg font-black tracking-tight text-slate-800 uppercase">
            <HiOutlineCloudUpload className="text-blue-600" size={24} /> Kích
            hoạt thủ công
          </h3>
          <div className="space-y-4">
            {SERVICES_TO_SYNC.map((svc) => (
              <div
                key={svc.id}
                className="flex flex-col gap-3 rounded-2xl border border-slate-100 p-4 transition-colors hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${svc.bg} ${svc.color}`}
                  >
                    <HiOutlineDatabase size={20} />
                  </div>
                  <span className="text-sm font-black text-slate-800">
                    {svc.name}
                  </span>
                </div>
                <Button
                  onClick={() => handleTriggerSync(svc.id, svc.name)}
                  disabled={syncingService !== null}
                  className={`h-10 w-full rounded-xl text-[10px] font-black tracking-widest text-white uppercase shadow-md transition-all ${svc.btn} ${syncingService === svc.id ? "opacity-80" : ""}`}
                >
                  {syncingService === svc.id ? (
                    <>
                      <AiOutlineLoading3Quarters className="mr-2 h-4 w-4 animate-spin" />{" "}
                      Đang Rút Data...
                    </>
                  ) : (
                    "Đồng bộ Dữ Liệu"
                  )}
                </Button>
              </div>
            ))}
          </div>
        </Card>

        <Card className="overflow-hidden rounded-[32px] border-none bg-white shadow-sm lg:col-span-2">
          <CardHeader className="border-b border-slate-50 p-6 px-8">
            <CardTitle className="text-xl font-black tracking-tighter text-slate-800 uppercase">
              Lịch Sử Luân Chuyển
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="border-none">
                  <TableHead className="py-4 pl-8 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Thời Gian
                  </TableHead>
                  <TableHead className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Nguồn (Source)
                  </TableHead>
                  <TableHead className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Số Lượng
                  </TableHead>
                  <TableHead className="pr-8 text-right text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Trạng Thái
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.length > 0 ? (
                  logs.map((log) => (
                    <TableRow
                      key={log.id}
                      className="border-b border-slate-50 hover:bg-slate-50"
                    >
                      <TableCell className="py-4 pl-8 text-xs font-bold text-slate-500">
                        {new Date(log.synced_at).toLocaleString("vi-VN")}
                      </TableCell>
                      <TableCell>
                        <span className="font-black text-slate-800 capitalize">
                          {log.source_service}
                        </span>
                        <p className="text-[10px] font-bold text-slate-400">
                          {log.sync_type}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge className="rounded-lg border-none bg-slate-100 px-2 font-black text-slate-600 shadow-none hover:bg-slate-200">
                          {log.records_synced} records
                        </Badge>
                      </TableCell>
                      <TableCell className="pr-8 text-right">
                        {log.status === "success" ? (
                          <Badge className="rounded-xl border-none bg-green-50 px-3 py-1 text-[9px] font-black text-green-600 uppercase shadow-none">
                            Hoàn tất
                          </Badge>
                        ) : (
                          <Badge className="rounded-xl border-none bg-red-50 px-3 py-1 text-[9px] font-black text-red-600 uppercase shadow-none">
                            Thất bại
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="py-20 text-center font-black tracking-widest text-slate-300 uppercase italic"
                    >
                      Chưa có lịch sử đồng bộ nào
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default SyncDashboard;
