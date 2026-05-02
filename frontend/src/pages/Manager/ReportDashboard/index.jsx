import { useState, useEffect } from "react";
import {
  HiOutlineCurrencyDollar,
  HiOutlineUserGroup,
  HiOutlineClipboardCheck,
  HiOutlineTrendingUp,
  HiOutlineDownload,
} from "react-icons/hi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";

import { getDashboardData } from "@/services/reportService";

function ReportDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const result = await getDashboardData();

      if (result && result.success) {
        setData(result.data);
      } else {
        toast.error("Không thể lấy dữ liệu thống kê!");
      }
    } catch (error) {
      console.error("Lỗi Dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    if (!value) return "0 đ";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  if (loading || !data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50">
        <AiOutlineLoading3Quarters className="animate-spin text-5xl text-(--primaryCustom)" />
        <p className="animate-pulse text-[12px] font-black tracking-widest text-slate-400 uppercase">
          Đang truy xuất kho dữ liệu NiFi...
        </p>
      </div>
    );
  }

  const overview = data.overview || {};
  const recentReports = Array.isArray(data.recent_reports)
    ? data.recent_reports
    : [];

  // Chuyển Object Doanh thu thành Array vẽ LineChart
  const rawRevenue = data.revenue_stats || {};
  const revenueStats = [
    {
      name: rawRevenue.period || "Tháng này",
      value: rawRevenue.total_revenue || 0,
    },
  ];

  // Chuyển Object Tiến độ điều trị thành Array  để vẽ BarChart
  const rawTreatment = data.treatment_stats || {};
  const treatmentStats = [
    {
      name: rawTreatment.period || "Tháng này",
      "Đang điều trị": rawTreatment.in_progress || 0,
      "Hoàn thành": rawTreatment.completed || 0,
      "Đã hủy": rawTreatment.cancelled || 0,
    },
  ];

  return (
    <div className="animate-in fade-in zoom-in-95 min-h-screen space-y-8 bg-slate-50/50 p-8 duration-500">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Trung Tâm Phân Tích & Báo Cáo
          </h1>
          <p className="mt-1 font-medium text-slate-500">
            Tổng hợp dữ liệu từ các Microservices thông qua hệ thống ETL.
          </p>
        </div>
        <Button
          onClick={() =>
            toast.success("Tính năng xuất báo cáo tự động đang được cập nhật!")
          }
          className="h-12 cursor-pointer rounded-2xl bg-(--primaryCustom) px-6 font-black tracking-widest text-white uppercase shadow-lg shadow-blue-200 transition-all hover:-translate-y-1 hover:opacity-90"
        >
          <HiOutlineDownload className="mr-2 h-5 w-5" /> Yêu cầu Báo Cáo
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-[24px] border-none bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-green-100/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Tổng Doanh Thu
            </CardTitle>
            <div className="rounded-xl bg-green-50 p-3 text-green-500">
              <HiOutlineCurrencyDollar className="h-6 w-6" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-800">
              {formatCurrency(overview.total_revenue)}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[24px] border-none bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-100/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Tỷ lệ thành công (IVF)
            </CardTitle>
            <div className="rounded-xl bg-blue-50 p-3 text-blue-500">
              <HiOutlineTrendingUp className="h-6 w-6" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-800">
              {overview.success_rate || 0}%
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[24px] border-none bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-100/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Ca đang điều trị
            </CardTitle>
            <div className="rounded-xl bg-amber-50 p-3 text-amber-500">
              <HiOutlineClipboardCheck className="h-6 w-6" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-800">
              {overview.active_treatments || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[24px] border-none bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-100/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Tổng bệnh nhân
            </CardTitle>
            <div className="rounded-xl bg-purple-50 p-3 text-purple-500">
              <HiOutlineUserGroup className="h-6 w-6" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-800">
              {overview.total_patients || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="rounded-[32px] border-none bg-white p-6 shadow-sm">
          <h3 className="mb-6 text-lg font-black tracking-tight text-slate-800 uppercase">
            Biểu Đồ Doanh Thu Tháng Này
          </h3>
          <div className="flex h-72 w-full items-center justify-center rounded-2xl bg-slate-50/50">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueStats} barSize={60}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#94a3b8", fontWeight: "bold" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#94a3b8", fontWeight: "bold" }}
                  tickFormatter={(value) => `${value / 1000000}Tr`}
                />
                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Bar
                  dataKey="value"
                  name="Doanh thu"
                  fill="var(--primaryCustom)"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="rounded-[32px] border-none bg-white p-6 shadow-sm">
          <h3 className="mb-6 text-lg font-black tracking-tight text-slate-800 uppercase">
            Tiến Độ Ca Điều Trị
          </h3>
          <div className="flex h-72 w-full items-center justify-center rounded-2xl bg-slate-50/50">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={treatmentStats} barSize={30}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#94a3b8", fontWeight: "bold" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#94a3b8", fontWeight: "bold" }}
                />
                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Legend
                  iconType="circle"
                  wrapperStyle={{
                    fontSize: "12px",
                    fontWeight: "bold",
                    paddingTop: "20px",
                  }}
                />
                <Bar
                  dataKey="Đang điều trị"
                  fill="#f59e0b"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="Hoàn thành"
                  fill="#22c55e"
                  radius={[4, 4, 0, 0]}
                />
                <Bar dataKey="Đã hủy" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="rounded-[32px] border-none bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-black tracking-tight text-slate-800 uppercase">
          Tài liệu báo cáo đã xử lý
        </h3>
        <div className="space-y-4">
          {recentReports.length > 0 ? (
            recentReports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between rounded-2xl border border-slate-100 p-4 transition-colors hover:bg-slate-50"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <HiOutlineClipboardCheck size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-800">
                      {report.name || "Báo cáo hệ thống"}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">
                      {new Date(report.created_at).toLocaleString("vi-VN")}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() =>
                    window.open(
                      `http://127.0.0.1:8006/api/reports/${report.id}/download`,
                      "_blank",
                    )
                  }
                  className="h-9 cursor-pointer rounded-xl border-blue-200 text-[10px] font-black text-blue-600 uppercase hover:bg-blue-50"
                >
                  <HiOutlineDownload className="mr-1" /> Tải File
                </Button>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-xs font-bold tracking-widest text-slate-400 uppercase">
              Hệ thống chưa tạo báo cáo nào
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

export default ReportDashboard;
