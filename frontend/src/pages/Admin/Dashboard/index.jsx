import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getAllManagers } from "@/services/adminService";
import { getAllPosts } from "@/services/blogService";
import { getDoctors } from "@/services/managerService";
import { getTreatmentDashboard, getCustomers } from "@/services/doctorService";
import { getAllProtocols } from "@/services/protocolService";

import {
  HiOutlineShieldCheck,
  HiOutlineUserGroup,
  HiOutlineDatabase,
  HiOutlineChartBar,
  HiOutlineBookOpen,
  HiOutlineExternalLink,
  HiOutlineRefresh,
  HiOutlineTerminal,
  HiOutlineGlobeAlt,
  HiOutlineMail,
} from "react-icons/hi";
import { RiAdminLine } from "react-icons/ri";
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

function AdminDashboard() {
  const navigate = useNavigate();

  const [managers, setManagers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [posts, setPosts] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [protocols, setProtocols] = useState([]);

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("managers");
  const [systemStats, setSystemStats] = useState({
    totalManagers: 0,
    totalDoctors: 0,
    totalPosts: 0,
    activeTreatments: 0,
  });

  const fetchAdminData = useCallback(async () => {
    try {
      setLoading(true);
      const [manRes, postRes, docRes, treatRes, patientRes, protocolRes] =
        await Promise.all([
          getAllManagers().catch(() => ({ data: [] })),
          getAllPosts().catch(() => ({ data: [] })),
          getDoctors().catch(() => ({ data: [] })),
          getTreatmentDashboard().catch(() => ({ data: {} })),
          getCustomers().catch(() => ({ data: [] })),
          getAllProtocols().catch(() => ({ data: [] })),
        ]);

      setManagers(manRes.data || []);
      setDoctors(docRes.data || []);
      setPosts(postRes.data || []);
      setTreatments(patientRes.data || []);
      setProtocols(protocolRes.data || protocolRes || []);

      setSystemStats({
        totalManagers: manRes.data?.length || 0,
        totalDoctors: docRes.data?.length || 0,
        totalPosts: postRes.data?.length || 0,
        activeTreatments: treatRes.data?.active_treatments || 0,
      });
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error("Lỗi đồng bộ dữ liệu hệ thống!");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  const renderActiveContent = () => {
    if (loading)
      return (
        <div className="flex h-64 flex-col items-center justify-center gap-4 text-slate-500">
          <HiOutlineRefresh className="animate-spin text-4xl" />
          <p className="font-mono text-xs font-bold tracking-widest uppercase">
            Accessing encrypted data streams...
          </p>
        </div>
      );

    switch (activeTab) {
      case "managers":
        return (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {managers.map((man) => (
              <div
                key={man.id}
                onClick={() => navigate("/manager/dashboard")}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-700 bg-slate-800/50 p-6 transition-all hover:-translate-y-1 hover:border-blue-500 hover:bg-slate-800"
              >
                <h3 className="text-lg font-black text-blue-400 group-hover:text-blue-300">
                  {man.name}
                </h3>
                <div className="mt-2 flex items-center gap-2 text-sm text-slate-400">
                  <HiOutlineMail /> {man.email}
                </div>
                <div className="absolute -right-2 -bottom-2 opacity-5">
                  <RiAdminLine size={80} />
                </div>
              </div>
            ))}
          </div>
        );
      case "doctors":
        return (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {doctors.map((doc) => (
              <div
                key={doc.id}
                onClick={() => navigate("/manager/dashboard")}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-700 bg-slate-800/50 p-6 transition-all hover:-translate-y-1 hover:border-emerald-500 hover:bg-slate-800"
              >
                <h3 className="text-lg font-black text-emerald-400 group-hover:text-emerald-300">
                  {doc.name}
                </h3>
                <div className="mt-2 flex items-center gap-2 text-sm text-slate-400">
                  <HiOutlineMail /> {doc.email}
                </div>
                <div className="absolute -right-2 -bottom-2 opacity-5">
                  <HiOutlineUserGroup size={80} />
                </div>
              </div>
            ))}
          </div>
        );
      case "posts":
        return (
          <div className="grid grid-cols-1 gap-4">
            {posts.slice(0, 6).map((post) => (
              <div
                key={post.id}
                onClick={() => navigate("/manager/manage-blog")}
                className="group flex cursor-pointer items-center justify-between rounded-2xl border border-slate-700 bg-slate-800/30 p-4 transition-all hover:border-purple-500/50 hover:bg-slate-800"
              >
                <div className="flex items-center gap-4 text-left">
                  <img
                    src={post.image}
                    className="h-14 w-14 rounded-xl object-cover"
                    alt="thumb"
                  />
                  <div>
                    <h4 className="line-clamp-1 font-black text-white transition-colors group-hover:text-purple-400">
                      {post.title}
                    </h4>
                    <p className="text-[11px] font-bold tracking-tight text-slate-500 uppercase">
                      Tác giả: {post.user?.name}
                    </p>
                  </div>
                </div>
                <Badge className="border-none bg-purple-500/10 px-3 font-black text-purple-400 uppercase">
                  {post.views} VIEWS
                </Badge>
              </div>
            ))}
          </div>
        );
      case "treatments":
        return (
          <div className="overflow-hidden rounded-2xl border border-slate-700">
            <Table>
              <TableHeader className="bg-slate-800/50">
                <TableRow className="border-slate-700 hover:bg-transparent">
                  <TableHead className="py-4 pl-6 text-[10px] font-black text-slate-400 uppercase">
                    Bệnh nhân điều trị
                  </TableHead>
                  <TableHead className="text-[10px] font-black text-slate-400 uppercase">
                    Ngày tiếp nhận
                  </TableHead>
                  <TableHead className="pr-6 text-right text-[10px] font-black text-slate-400 uppercase">
                    Thao tác
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {treatments.slice(0, 8).map((t) => {
                  const patientProtocol = protocols.find(
                    (p) =>
                      String(p.user_id) === String(t.id) ||
                      String(p.treatment_id) === String(t.id),
                  );
                  return (
                    <TableRow
                      key={t.id}
                      onClick={() =>
                        patientProtocol
                          ? navigate(
                              `/doctor/protocols/details/${patientProtocol.id}`,
                            )
                          : navigate("/manager/reports")
                      }
                      className="group cursor-pointer border-slate-800 hover:bg-slate-800"
                    >
                      <TableCell className="py-4 pl-6 font-black text-slate-200 transition-colors group-hover:text-amber-400">
                        {t.name}
                      </TableCell>
                      <TableCell className="text-xs font-bold text-slate-400">
                        {new Date(t.created_at).toLocaleDateString("vi-VN")}
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <HiOutlineExternalLink className="inline-block text-amber-500 opacity-0 transition-all group-hover:opacity-100" />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="animate-in fade-in zoom-in-95 min-h-screen space-y-8 bg-slate-950 p-6 text-white duration-500 md:p-8">
      <div className="flex flex-col items-start justify-between gap-4 border-b border-slate-800 pb-6 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-amber-500 p-3 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
            <HiOutlineShieldCheck size={32} className="text-slate-950" />
          </div>
          <div>
            <h1 className="text-4xl leading-none font-black tracking-tighter uppercase">
              Admin <span className="text-amber-500">Root</span>
            </h1>
            <p className="mt-2 text-xs font-bold tracking-[0.2em] text-slate-500 uppercase">
              Medicen Command Center v2.1.0
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge className="border-amber-500/50 bg-amber-500/10 px-4 py-2 text-xs font-black tracking-widest text-amber-500 uppercase">
            System Online
          </Badge>
          <Button
            onClick={fetchAdminData}
            className="h-12 rounded-2xl bg-amber-500 px-6 font-black text-slate-950 uppercase shadow-lg shadow-amber-500/20 transition-all hover:bg-amber-400 active:scale-95"
          >
            <HiOutlineRefresh
              className={`mr-2 h-5 w-5 ${loading ? "animate-spin" : ""}`}
            />{" "}
            Làm mới
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
        {[
          {
            name: "Landing Page",
            path: "/",
            icon: HiOutlineGlobeAlt,
            color: "bg-blue-600 shadow-blue-500/20",
          },
          {
            name: "Đồng bộ NiFi",
            path: "/manager/sync",
            icon: HiOutlineTerminal,
            color: "bg-emerald-600 shadow-emerald-500/20",
          },
          {
            name: "Hệ thống Báo cáo",
            path: "/manager/reports",
            icon: HiOutlineChartBar,
            color: "bg-rose-600 shadow-rose-500/20",
          },
          {
            name: "Quản lý Blog",
            path: "/manager/manage-blog",
            icon: HiOutlineBookOpen,
            color: "bg-purple-600 shadow-purple-500/20",
          },
          {
            name: "Dashboard Manager",
            path: "/manager/dashboard",
            icon: HiOutlineUserGroup,
            color: "bg-slate-700 shadow-slate-500/20",
          },
        ].map((btn, i) => (
          <Button
            key={i}
            onClick={() => navigate(btn.path)}
            className={`${btn.color} group relative h-20 overflow-hidden rounded-[24px] border-none font-black tracking-widest text-white uppercase shadow-xl transition-all hover:-translate-y-1 hover:brightness-110`}
          >
            <div className="z-10 flex items-center gap-3">
              <btn.icon size={24} /> <span>{btn.name}</span>
            </div>
            <btn.icon
              size={80}
              className="absolute -right-4 -bottom-4 opacity-10 transition-transform group-hover:scale-110"
            />
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            id: "managers",
            label: "Quản lý",
            val: systemStats.totalManagers,
            icon: RiAdminLine,
            color: "blue",
          },
          {
            id: "doctors",
            label: "Bác sĩ",
            val: systemStats.totalDoctors,
            icon: HiOutlineUserGroup,
            color: "emerald",
          },
          {
            id: "posts",
            label: "Blog Y Khoa",
            val: systemStats.totalPosts,
            icon: HiOutlineBookOpen,
            color: "purple",
          },
          {
            id: "treatments",
            label: "Ca điều trị",
            val: systemStats.activeTreatments,
            icon: HiOutlineDatabase,
            color: "amber",
          },
        ].map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`cursor-pointer rounded-[32px] border-2 p-8 transition-all duration-300 ${
              activeTab === item.id
                ? `border-${item.color}-500 bg-${item.color}-500/10 scale-105 shadow-[0_0_30px_rgba(0,0,0,0.3)]`
                : "border-slate-800 bg-slate-900/50 hover:border-slate-700"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-[10px] font-black tracking-[0.2em] uppercase ${activeTab === item.id ? `text-${item.color}-400` : "text-slate-500"}`}
                >
                  {item.label}
                </p>
                <h3 className="mt-2 text-4xl font-black">{item.val}</h3>
              </div>
              <item.icon
                size={44}
                className={
                  activeTab === item.id
                    ? `text-${item.color}-400`
                    : "text-slate-700"
                }
              />
            </div>
          </div>
        ))}
      </div>

      <Card className="rounded-[40px] border-none bg-slate-900/80 p-10 shadow-2xl backdrop-blur-xl">
        <CardHeader className="mb-8 border-b border-slate-800 px-0 pt-0 pb-8">
          <CardTitle className="flex items-center gap-4 text-3xl font-black tracking-tighter uppercase">
            {activeTab === "managers" && (
              <>
                <RiAdminLine className="text-blue-500" /> Danh sách điều hành
                cấp cao
              </>
            )}
            {activeTab === "doctors" && (
              <>
                <HiOutlineUserGroup className="text-emerald-500" /> Đội ngũ
                chuyên gia y tế
              </>
            )}
            {activeTab === "posts" && (
              <>
                <HiOutlineBookOpen className="text-purple-500" /> Thư viện kiến
                thức cộng đồng
              </>
            )}
            {activeTab === "treatments" && (
              <>
                <HiOutlineDatabase className="text-amber-500" /> Theo dõi ca
                phác đồ thực tế
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="min-h-[400px] px-0">
          {renderActiveContent()}
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminDashboard;
