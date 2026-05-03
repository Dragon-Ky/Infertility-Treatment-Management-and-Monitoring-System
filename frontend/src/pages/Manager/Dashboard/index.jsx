import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDoctors } from "@/services/managerService";
import {
  HiOutlineUserGroup,
  HiOutlineChartSquareBar,
  HiOutlineRefresh,
  HiOutlineShieldCheck,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineBookOpen,
} from "react-icons/hi";
import { FiActivity } from "react-icons/fi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function ManagerDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAllDoctors, setShowAllDoctors] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const res = await getDoctors();
        setDoctors(res.data || []);
      } catch (error) {
        console.error("Lỗi lấy danh sách bác sĩ:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const todayStr = new Intl.DateTimeFormat("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());

  const displayedDoctors = showAllDoctors ? doctors : doctors.slice(0, 4);

  return (
    <div className="animate-in fade-in zoom-in-95 min-h-screen space-y-8 bg-slate-50 p-6 duration-500 md:p-8">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">
            Trung Tâm Điều Hành
          </h1>
          <p className="mt-2 font-medium text-slate-500">
            Xin chào Quản lý! Hôm nay là{" "}
            <span className="font-bold text-blue-600">{todayStr}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-700 shadow-sm">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
          </span>
          System Online
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="group relative cursor-pointer overflow-hidden rounded-[32px] bg-gradient-to-br from-blue-500 to-blue-700 p-8 text-white shadow-xl shadow-blue-200 transition-all hover:-translate-y-2 hover:shadow-2xl">
          <div className="relative z-10 flex flex-col items-start">
            <div className="mb-4 rounded-2xl bg-white/20 p-4 backdrop-blur-md">
              <HiOutlineUserGroup size={32} />
            </div>
            <h2 className="text-xl font-black tracking-widest uppercase">
              Đội Ngũ Y Tế
            </h2>
            <p className="mt-2 text-sm font-medium text-blue-100">
              Quản lý hồ sơ, phân quyền và lịch làm việc của Bác sĩ.
            </p>
          </div>
          <HiOutlineUserGroup className="absolute -right-4 -bottom-4 z-0 text-[120px] text-white opacity-10 transition-transform group-hover:scale-110" />
        </div>

        <div
          onClick={() => navigate("/manager/reports")}
          className="group relative cursor-pointer overflow-hidden rounded-[32px] bg-gradient-to-br from-purple-500 to-indigo-700 p-8 text-white shadow-xl shadow-purple-200 transition-all hover:-translate-y-2 hover:shadow-2xl"
        >
          <div className="relative z-10 flex flex-col items-start">
            <div className="mb-4 rounded-2xl bg-white/20 p-4 backdrop-blur-md">
              <HiOutlineChartSquareBar size={32} />
            </div>
            <h2 className="text-xl font-black tracking-widest uppercase">
              Phân Tích Dữ Liệu
            </h2>
            <p className="mt-2 text-sm font-medium text-purple-100">
              Xem Dashboard biểu đồ và xuất báo cáo PDF tự động.
            </p>
          </div>
          <HiOutlineChartSquareBar className="absolute -right-4 -bottom-4 z-0 text-[120px] text-white opacity-10 transition-transform group-hover:scale-110" />
        </div>

        <div
          onClick={() => navigate("/manager/sync")}
          className="group relative cursor-pointer overflow-hidden rounded-[32px] bg-gradient-to-br from-emerald-500 to-teal-700 p-8 text-white shadow-xl shadow-emerald-200 transition-all hover:-translate-y-2 hover:shadow-2xl"
        >
          <div className="relative z-10 flex flex-col items-start">
            <div className="mb-4 rounded-2xl bg-white/20 p-4 backdrop-blur-md">
              <HiOutlineRefresh size={32} />
            </div>
            <h2 className="text-xl font-black tracking-widest uppercase">
              Đồng Bộ Hệ Thống
            </h2>
            <p className="mt-2 text-sm font-medium text-emerald-100">
              Quản lý luồng ETL Apache NiFi giữa các Microservices.
            </p>
          </div>
          <HiOutlineRefresh className="absolute -right-4 -bottom-4 z-0 text-[120px] text-white opacity-10 transition-transform group-hover:scale-110" />
        </div>

        <div
          onClick={() => navigate("/manager/manage-blog")}
          className="group relative cursor-pointer overflow-hidden rounded-[32px] bg-gradient-to-br from-slate-700 to-slate-900 p-8 text-white shadow-xl shadow-slate-200 transition-all hover:-translate-y-2 hover:shadow-2xl"
        >
          <div className="relative z-10 flex flex-col items-start">
            <div className="mb-4 rounded-2xl bg-white/20 p-4 backdrop-blur-md">
              <HiOutlineBookOpen size={32} />
            </div>
            <h2 className="text-xl font-black tracking-widest uppercase">
              Quản lý Blog
            </h2>
            <p className="mt-2 text-sm font-medium text-slate-300">
              Đăng bài viết mới và quản lý nội dung kiến thức y khoa.
            </p>
          </div>
          <HiOutlineBookOpen className="absolute -right-4 -bottom-4 z-0 text-[120px] text-white opacity-10 transition-transform group-hover:scale-110" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <Card className="col-span-1 rounded-[32px] border-none bg-white shadow-sm lg:col-span-2">
          <CardHeader className="border-b border-slate-50 px-8 py-6">
            <CardTitle className="flex items-center gap-3 text-lg font-black tracking-widest text-slate-800 uppercase">
              <HiOutlineUserGroup className="text-blue-600" size={24} />
              Nhân Sự Đang Hoạt Động ({doctors.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
              </div>
            ) : (
              <div className="transition-all duration-500 ease-in-out">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {displayedDoctors.map((doc) => (
                    <div
                      key={doc.id}
                      className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-all hover:border-blue-200 hover:bg-blue-50"
                    >
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xl font-black text-blue-600 shadow-inner">
                        {doc.name.charAt(0)}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <h3 className="truncate font-black text-slate-800 group-hover:text-blue-700">
                          {doc.name}
                        </h3>
                        <div className="mt-1 flex items-center gap-2 text-xs font-bold text-slate-400">
                          <HiOutlineMail />{" "}
                          <span className="truncate">{doc.email}</span>
                        </div>
                        <div className="mt-0.5 flex items-center gap-2 text-xs font-bold text-slate-400">
                          <HiOutlinePhone />{" "}
                          <span>{doc.phone || "Chưa cập nhật SĐT"}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {doctors.length === 0 && (
                    <div className="col-span-full py-10 text-center font-bold text-slate-400 italic">
                      Chưa có dữ liệu Bác sĩ.
                    </div>
                  )}
                </div>
              </div>
            )}

            {doctors.length > 4 && (
              <Button
                onClick={() => setShowAllDoctors(!showAllDoctors)}
                variant="outline"
                className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-dashed border-slate-300 font-bold text-slate-500 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600"
              >
                {showAllDoctors ? (
                  <>
                    Thu gọn danh sách <HiOutlineChevronUp size={18} />
                  </>
                ) : (
                  <>
                    Xem tất cả ({doctors.length}) nhân sự{" "}
                    <HiOutlineChevronDown size={18} />
                  </>
                )}
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1 h-fit rounded-[32px] border-none bg-white shadow-sm">
          <CardHeader className="border-b border-slate-50 px-8 py-6">
            <CardTitle className="flex items-center gap-3 text-lg font-black tracking-widest text-slate-800 uppercase">
              <FiActivity className="text-purple-600" size={24} />
              Trạng Thái Core
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-green-100 p-2 text-green-600">
                  <HiOutlineShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-700">Auth Service</h4>
                  <p className="text-[10px] font-black text-slate-400 uppercase">
                    Hoạt động bình thường
                  </p>
                </div>
              </div>
              <span className="font-bold text-green-500">99.9%</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-green-100 p-2 text-green-600">
                  <HiOutlineShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-700">
                    Treatment Service
                  </h4>
                  <p className="text-[10px] font-black text-slate-400 uppercase">
                    Hoạt động bình thường
                  </p>
                </div>
              </div>
              <span className="font-bold text-green-500">99.8%</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                  <HiOutlineRefresh size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-700">
                    NiFi ETL Pipeline
                  </h4>
                  <p className="text-[10px] font-black text-slate-400 uppercase">
                    Chờ lệnh đồng bộ
                  </p>
                </div>
              </div>
              <span className="font-bold text-blue-500">Standby</span>
            </div>

            <div className="mt-8 rounded-2xl bg-slate-50 p-4 text-center">
              <p className="text-xs font-bold text-slate-500">
                Phiên bản hệ thống:{" "}
                <span className="text-slate-800">v2.1.0</span>
              </p>
              <p className="mt-1 text-[10px] font-medium text-slate-400">
                Cập nhật lần cuối: Hôm nay
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ManagerDashboard;
