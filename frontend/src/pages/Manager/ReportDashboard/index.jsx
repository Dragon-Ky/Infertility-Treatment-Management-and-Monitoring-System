import { useState, useEffect } from "react";
import { HiOutlineDownload } from "react-icons/hi";
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
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  getDashboardData,
  getRevenueReport,
  getTreatmentSuccessReport,
  getPatientsReport,
  getDoctorsReport,
  generateReport,
} from "@/services/reportService";

const COLORS = ["#2563eb", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"];

function ReportDashboard() {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState({});
  const [analytics, setAnalytics] = useState({
    revenue: [],
    treatment: [],
    patients: [],
    doctors: [],
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const currentMonth = new Date().toISOString().slice(0, 7); // Format: YYYY-MM

      // Gọi đồng loạt cả 5 API cùng lúc
      const [dashRes, revRes, treatRes, patRes, docRes] = await Promise.all([
        getDashboardData().catch(() => null),
        getRevenueReport(currentMonth).catch(() => null),
        getTreatmentSuccessReport(currentMonth).catch(() => null),
        getPatientsReport(currentMonth).catch(() => null),
        getDoctorsReport(currentMonth).catch(() => null),
      ]);

      if (dashRes?.success) setOverview(dashRes.data.overview || {});

      // Mapping dữ liệu để đưa vào biểu đồ Recharts
      setAnalytics({
        revenue: formatChartData(revRes?.data, "Doanh Thu"),
        treatment: formatChartData(treatRes?.data, "Ca"),
        patients: formatChartData(patRes?.data, "Bệnh nhân"),
        // Mảng danh sách bác sĩ
        doctors: Array.isArray(docRes?.data) ? docRes.data : [],
      });
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error("Có lỗi xảy ra khi tải dữ liệu phân tích!");
    } finally {
      setLoading(false);
    }
  };

  // Hàm biến đổi Object thành Array để Recharts đọc được
  const formatChartData = (dataObj, valueName) => {
    if (!dataObj || typeof dataObj !== "object") return [];
    return Object.entries(dataObj)
      .filter(
        ([key, val]) => typeof val === "number" && key !== "total_revenue",
      ) // Lọc bỏ số tổng
      .map(([key, val]) => ({
        name: key.replace(/_/g, " ").toUpperCase(),
        [valueName]: val,
      }));
  };

  const handleGenerateReport = async () => {
    try {
      toast.loading("Đang tổng hợp dữ liệu và xuất PDF...", { id: "generate" });

      // Gửi lệnh tạo Report
      const res = await generateReport({
        name: "Báo cáo Tổng hợp Tháng",
        type: "monthly",
        parameters: { period: new Date().toISOString().slice(0, 7) },
      });

      if (res && res.success) {
        toast.success("Đã đúc xong PDF! Bắt đầu tải xuống...", {
          id: "generate",
        });

        const reportId = res.data.id;
        const downloadUrl = `http://127.0.0.1:8006/api/reports/${reportId}/download`;

        // Ép trình duyệt tải
        window.location.href = downloadUrl;
      }
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error("Lỗi kết nối khi tạo báo cáo!", { id: "generate" });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50">
        <AiOutlineLoading3Quarters className="animate-spin text-5xl text-blue-600" />
        <p className="animate-pulse text-[12px] font-black tracking-widest text-slate-400 uppercase">
          Đang vẽ biểu đồ thống kê...
        </p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in zoom-in-95 min-h-screen space-y-8 bg-slate-50/50 p-8 duration-500">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Phân Tích Dữ Liệu Chuyên Sâu
          </h1>
          <p className="mt-1 font-medium text-slate-500">
            Truy xuất trực tiếp từ 4 API Core của Report Microservice
          </p>
        </div>
        <Button
          onClick={handleGenerateReport}
          className="h-12 cursor-pointer rounded-2xl bg-blue-600 px-6 font-black tracking-widest text-white uppercase shadow-lg transition-all hover:-translate-y-1"
        >
          <HiOutlineDownload className="mr-2 h-5 w-5" /> Xuất Báo Cáo
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-[24px] border-none bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-[10px] font-black text-slate-400 uppercase">
              Tổng Doanh Thu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">
              {new Intl.NumberFormat("vi-VN").format(
                overview.total_revenue || 0,
              )}{" "}
              đ
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-[24px] border-none bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-[10px] font-black text-slate-400 uppercase">
              Tỷ lệ IVF
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-blue-600">
              {overview.success_rate || 0}%
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-[24px] border-none bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-[10px] font-black text-slate-400 uppercase">
              Đang điều trị
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-amber-500">
              {overview.active_treatments || 0}
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-[24px] border-none bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-[10px] font-black text-slate-400 uppercase">
              Tổng bệnh nhân
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-purple-600">
              {overview.total_patients || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Revenue (Doanh thu) */}
        <Card className="rounded-[32px] border-none bg-white p-6 shadow-sm">
          <h3 className="mb-6 text-lg font-black text-slate-800 uppercase">
            Cơ cấu Doanh Thu
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analytics.revenue}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fontWeight: "bold" }}
                />
                <YAxis
                  tick={{ fontSize: 10 }}
                  tickFormatter={(val) =>
                    val >= 1000000
                      ? `${val / 1000000}Tr`
                      : new Intl.NumberFormat("vi-VN").format(val)
                  }
                />
                <Tooltip cursor={{ fill: "#f8fafc" }} />
                <Bar
                  dataKey="Doanh Thu"
                  fill="#22c55e"
                  radius={[6, 6, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Apo treatment success (Tỉ lệ IVF) */}
        <Card className="rounded-[32px] border-none bg-white p-6 shadow-sm">
          <h3 className="mb-6 text-lg font-black text-slate-800 uppercase">
            Trạng Thái Phác Đồ
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.treatment}
                  dataKey="Ca"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  label
                >
                  {analytics.treatment.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Api patients (Khách hàng) */}
        <Card className="rounded-[32px] border-none bg-white p-6 shadow-sm">
          <h3 className="mb-6 text-lg font-black text-slate-800 uppercase">
            Thống Kê Bệnh Nhân
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={analytics.patients}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fontWeight: "bold" }}
                />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="Bệnh nhân"
                  stroke="#8b5cf6"
                  fill="#c4b5fd"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Api doctors (Bác sĩ) */}
        <Card className="rounded-[32px] border-none bg-white p-6 shadow-sm">
          <h3 className="mb-6 text-lg font-black text-slate-800 uppercase">
            Hiệu Suất Bác Sĩ
          </h3>
          <div className="flex h-72 w-full items-center justify-center rounded-2xl border border-slate-100 bg-slate-50/50">
            {analytics.doctors.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analytics.doctors}
                  layout="vertical"
                  margin={{ top: 10, right: 30, left: 20, bottom: 0 }}
                >
                  <XAxis type="number" />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 12, fontWeight: "bold" }}
                  />
                  <Tooltip />
                  <Bar
                    dataKey="cases"
                    fill="#3b82f6"
                    radius={[0, 4, 4, 0]}
                    barSize={20}
                    name="Số ca xử lý"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                Chưa có dữ liệu hiệu suất bác sĩ
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default ReportDashboard;
