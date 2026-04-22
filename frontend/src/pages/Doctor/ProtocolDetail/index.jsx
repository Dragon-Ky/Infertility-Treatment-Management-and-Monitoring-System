import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProtocolDetail } from "@/services/protocolService";
import { getCustomers } from "@/services/doctorService";

import {
  HiOutlineChevronLeft,
  HiOutlineUser,
  HiOutlineBeaker,
  HiOutlineClock,
  HiOutlinePencilAlt,
} from "react-icons/hi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";

function ProtocolDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [protocol, setProtocol] = useState(null);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        // 1. Lấy chi tiết phác đồ
        const protocolRes = await getProtocolDetail(id);
        const protocolData = protocolRes.data;
        setProtocol(protocolData);

        // 2. Lấy thông tin bệnh nhân từ Auth-Service dựa trên treatment_id
        if (protocolData?.treatment_id) {
          const customerRes = await getCustomers();
          const foundPatient = customerRes.data.find(
            (c) => String(c.id) === String(protocolData.treatment_id),
          );
          setPatient(foundPatient);
        }
      } catch (error) {
        toast.error("Không thể tải chi tiết phác đồ!");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading)
    return (
      <div className="animate-pulse p-10 text-center font-black">
        ĐANG TẢI HỒ SƠ BỆNH ÁN...
      </div>
    );
  if (!protocol)
    return <div className="p-10 text-center">Không tìm thấy dữ liệu.</div>;

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate("/doctor/protocols")}
          className="gap-2 rounded-xl font-bold text-slate-500 hover:bg-white"
        >
          <HiOutlineChevronLeft size={20} /> QUAY LẠI DANH SÁCH
        </Button>
        <Button className="gap-2 rounded-xl bg-blue-600 font-bold">
          <HiOutlinePencilAlt size={18} /> CHỈNH SỬA PHÁC ĐỒ
        </Button>
      </div>

      {/* Header Profile Bệnh Nhân */}
      <Card className="overflow-hidden rounded-3xl border-none bg-white shadow-sm">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 text-white">
          <div className="flex items-center gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-white/20 bg-white/10 backdrop-blur-md">
              <HiOutlineUser size={40} className="text-blue-400" />
            </div>
            <div>
              <div className="mb-1 flex items-center gap-3">
                <h2 className="text-3xl font-black tracking-tight uppercase">
                  {patient?.name || `Bệnh nhân #${protocol.treatment_id}`}
                </h2>
                <Badge
                  className={
                    protocol.is_active ? "bg-green-500" : "bg-slate-500"
                  }
                >
                  {protocol.is_active ? "Đang điều trị" : "Đã kết thúc"}
                </Badge>
              </div>
              <p className="font-medium text-slate-400 italic">
                {patient?.email} • {patient?.phone || "Chưa cập nhật SĐT"}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="h-14 rounded-2xl border-none bg-white p-1 shadow-sm">
          <TabsTrigger
            value="overview"
            className="rounded-xl px-8 font-black data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            TỔNG QUAN
          </TabsTrigger>
          <TabsTrigger
            value="timeline"
            className="rounded-xl px-8 font-black data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            TIẾN TRÌNH (EVENTS)
          </TabsTrigger>
          <TabsTrigger
            value="lab"
            className="rounded-xl px-8 font-black data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            XÉT NGHIỆM
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Thông tin phác đồ */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card className="rounded-3xl border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-black tracking-widest text-slate-400 uppercase">
                  Chẩn đoán & Chỉ định
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="mb-1 text-xs font-black text-blue-600 uppercase">
                    Tên phác đồ
                  </p>
                  <p className="font-bold text-slate-800">
                    {protocol.protocol_name}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="mb-1 text-xs font-black text-blue-600 uppercase">
                    Chẩn đoán chuyên môn
                  </p>
                  <p className="leading-relaxed font-medium text-slate-700">
                    {protocol.diagnosis}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-black tracking-widest text-slate-400 uppercase">
                  Đơn thuốc & Ghi chú
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
                  <p className="mb-1 text-xs font-black text-blue-600 uppercase">
                    Đơn thuốc chỉ định
                  </p>
                  <p className="font-bold text-slate-700">
                    {protocol.prescription}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="mb-1 text-xs font-black text-slate-400 uppercase">
                    Ghi chú thêm
                  </p>
                  <p className="font-medium text-slate-600 italic">
                    "{protocol.notes || "Không có ghi chú"}"
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: Timeline - gọi API Events ở đây sau */}
        <TabsContent value="timeline">
          <Card className="rounded-3xl border-none p-10 text-center shadow-sm">
            <HiOutlineClock size={48} className="mx-auto mb-4 text-slate-200" />
            <p className="font-black text-slate-400 uppercase">
              Chưa có sự kiện điều trị nào được ghi nhận
            </p>
            <Button variant="outline" className="mt-4 rounded-xl border-dashed">
              THÊM SỰ KIỆN MỚI
            </Button>
          </Card>
        </TabsContent>

        {/* Tab 3: Xét nghiệm - gọi API Lab Results ở đây */}
        <TabsContent value="lab">
          <Card className="rounded-3xl border-none p-10 text-center shadow-sm">
            <HiOutlineBeaker
              size={48}
              className="mx-auto mb-4 text-slate-200"
            />
            <p className="font-black text-slate-400 uppercase">
              Dữ liệu xét nghiệm đang được đồng bộ...
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ProtocolDetail;
