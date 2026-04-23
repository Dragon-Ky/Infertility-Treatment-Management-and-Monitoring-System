import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProtocolDetail } from "@/services/protocolService";
import { getCustomers } from "@/services/doctorService";
import { getEventsByProtocol } from "@/services/eventService";
import { getLabResults } from "@/services/labService"; // Import service Lab
import AddEventModal from "@/components/AddEventModal";
import HormoneChart from "@/components/HormoneChart"; // Import Chart
import { getMedicationSchedules } from "@/services/scheduleService";

import {
  HiOutlineChevronLeft,
  HiOutlineUser,
  HiOutlineBeaker,
  HiOutlineClipboardCheck,
  HiOutlineClock,
  HiOutlineIdentification,
  HiOutlineCalendar,
  HiOutlineHashtag,
} from "react-icons/hi";
import { FaCapsules } from "react-icons/fa";
import { LuTablets, LuSyringe } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Import Table cho Lab
import toast from "react-hot-toast";

const ProtocolDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [protocol, setProtocol] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [events, setEvents] = useState([]);
  const [labResults, setLabResults] = useState([]); // State cho xét nghiệm
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const res = await getEventsByProtocol(id);
      setEvents(res.data || []);
    } catch (error) {
      console.error("Lỗi tải sự kiện:", error);
    }
  };

  useEffect(() => {
    const fetchFullData = async () => {
      setLoading(true);
      try {
        const [protocolRes, eventsRes, customerRes, labRes, scheduleRes] =
          await Promise.all([
            getProtocolDetail(id),
            getEventsByProtocol(id),
            getCustomers(),
            getLabResults(id),
            getMedicationSchedules(id),
          ]);

        const pData = protocolRes.data;
        setProtocol(pData);
        setEvents(eventsRes.data || []);
        setLabResults(labRes.data || []);
        setSchedules(scheduleRes.data || []);

        if (pData) {
          const targetId = pData.treatment_id || pData.customer_id;
          const foundCustomer = customerRes.data.find(
            (c) => String(c.id) === String(targetId),
          );
          setCustomer(foundCustomer);
        }
      } catch (error) {
        toast.error("Không thể kết nối đến dữ liệu Medicen!");
        console.error(error);
      } finally {
        setTimeout(() => setLoading(false), 600);
      }
    };

    fetchFullData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        <p className="animate-pulse text-[10px] font-black tracking-widest text-slate-400 uppercase">
          Đang đồng bộ hồ sơ Medicen...
        </p>
      </div>
    );
  }

  if (!protocol)
    return (
      <div className="p-10 text-center font-black text-slate-400">
        DỮ LIỆU KHÔNG TỒN TẠI
      </div>
    );

  return (
    <div className="animate-in fade-in zoom-in-95 min-h-screen space-y-6 bg-slate-50 p-6 duration-500">
      {/* Header Bar */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate("/doctor/protocols")}
            className="h-12 w-12 rounded-2xl border-none bg-white p-0 shadow-sm transition-all hover:bg-blue-600 hover:text-white"
          >
            <HiOutlineChevronLeft size={24} />
          </Button>
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-black tracking-tighter text-slate-900 uppercase">
              Phác đồ điều trị{" "}
              <span className="text-blue-600">#{protocol.id}</span>
            </h1>
            <p className="text-[10px] leading-none font-black tracking-[0.2em] text-slate-400 uppercase">
              Ngày khởi tạo: {protocol.created_at}
            </p>
          </div>
        </div>
        <div className="flex w-full gap-3 md:w-auto">
          <Button
            variant="outline"
            className="h-12 flex-1 rounded-2xl border-slate-200 text-xs font-black tracking-widest uppercase md:flex-none"
          >
            Xuất PDF
          </Button>
          <Button className="h-12 flex-1 rounded-2xl bg-slate-900 px-8 text-xs font-black tracking-widest text-white uppercase shadow-xl hover:bg-slate-800 md:flex-none">
            Chỉnh sửa
          </Button>
        </div>
      </div>

      {/* Profile Bệnh Nhân */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="overflow-hidden rounded-[32px] border-none bg-white shadow-sm lg:col-span-2">
          <div className="flex flex-col items-center gap-8 p-8 md:flex-row">
            <div className="relative">
              <div className="flex h-24 w-24 items-center justify-center rounded-[32px] bg-slate-900 text-3xl font-black text-white shadow-2xl">
                {customer?.name?.charAt(0) || "?"}
              </div>
              <div className="absolute -right-2 -bottom-2 flex h-10 w-10 items-center justify-center rounded-2xl border-4 border-white bg-blue-600 text-white shadow-lg">
                <HiOutlineIdentification size={20} />
              </div>
            </div>
            <div className="space-y-2 text-center md:text-left">
              <div className="flex items-center justify-center gap-3 md:justify-start">
                <h2 className="text-3xl leading-none font-black tracking-tighter text-slate-800 uppercase">
                  {customer
                    ? customer.name
                    : `Bệnh nhân #${protocol.treatment_id}`}
                </h2>
                <Badge
                  className={
                    protocol.is_active
                      ? "border-none bg-green-100 px-3 py-1 text-[10px] font-black text-green-700"
                      : "border-none bg-slate-100 text-[10px] font-black text-slate-500"
                  }
                >
                  {protocol.is_active ? "ĐANG ĐIỀU TRỊ" : "ĐÃ ĐÓNG"}
                </Badge>
              </div>
              <p className="text-sm font-bold text-slate-400">
                {customer?.email || "Liên hệ: N/A"} •{" "}
                {customer?.phone || "SĐT: N/A"}
              </p>
              <div className="flex items-center gap-2 pt-2">
                <div className="flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1 text-[10px] font-black tracking-widest text-blue-500 uppercase">
                  <HiOutlineHashtag size={14} /> ID: {protocol.treatment_id}
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  <HiOutlineUser size={14} /> BS. {protocol.doctor_id}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Progress Card */}
        <Card className="group relative overflow-hidden rounded-[32px] border-none bg-blue-600 p-8 text-white shadow-xl shadow-blue-100">
          <div className="relative z-10">
            <h3 className="mb-4 text-[10px] font-black tracking-[0.3em] text-blue-200 uppercase">
              Tiến trình IVF
            </h3>
            <div className="space-y-4">
              <div className="flex items-end justify-between">
                <span className="text-4xl leading-none font-black tracking-tighter uppercase italic">
                  Phase 1
                </span>
                <span className="text-xs font-bold text-blue-100 uppercase italic">
                  Medicen Clinic
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-blue-400/50">
                <div className="h-full w-2/3 animate-pulse bg-white shadow-[0_0_15px_white]"></div>
              </div>
            </div>
          </div>
          <HiOutlineBeaker
            size={140}
            className="absolute -right-8 -bottom-8 rotate-12 text-white/10"
          />
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="medical" className="space-y-6">
        <TabsList className="h-16 w-full gap-2 rounded-[24px] bg-white p-2 shadow-sm md:w-auto">
          <TabsTrigger
            value="medical"
            className="h-full rounded-xl px-12 text-[10px] font-black tracking-widest uppercase data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            HỒ SƠ Y TẾ
          </TabsTrigger>

          <TabsTrigger
            value="history"
            className="h-full rounded-xl px-12 text-[10px] font-black tracking-widest uppercase data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            NHẬT KÝ (EVENTS)
          </TabsTrigger>

          <TabsTrigger
            value="lab"
            className="h-full rounded-xl px-12 text-[10px] font-black tracking-widest uppercase data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            XÉT NGHIỆM (LAB)
          </TabsTrigger>

          <TabsTrigger
            value="schedule"
            className="h-full rounded-xl px-12 text-[10px] font-black tracking-widest uppercase data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            LỊCH THUỐC
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="medical"
          className="animate-in slide-in-from-bottom-4 duration-500"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card className="group space-y-6 rounded-[32px] border-none bg-white p-8 shadow-sm">
              <div className="flex items-center gap-3 text-blue-600">
                <div className="rounded-2xl bg-blue-50 p-3 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                  <HiOutlineClipboardCheck size={24} />
                </div>
                <h4 className="text-xl font-black tracking-tighter text-slate-800 uppercase">
                  Chẩn đoán
                </h4>
              </div>
              <div className="space-y-4">
                <div className="rounded-[24px] border-l-4 border-blue-600 bg-slate-50 p-6">
                  <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Tên phác đồ
                  </label>
                  <p className="text-lg font-black text-slate-800 uppercase">
                    {protocol.protocol_name}
                  </p>
                </div>
                <div className="rounded-[24px] bg-slate-50 p-6">
                  <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Nội dung bệnh lý
                  </label>
                  <p className="font-bold text-slate-600 italic">
                    "{protocol.diagnosis}"
                  </p>
                </div>
              </div>
            </Card>

            <Card className="group space-y-6 rounded-[32px] border-none bg-white p-8 shadow-sm">
              <div className="flex items-center gap-3 text-orange-500">
                <div className="rounded-2xl bg-orange-50 p-3 transition-colors group-hover:bg-orange-500 group-hover:text-white">
                  <HiOutlineBeaker size={24} />
                </div>
                <h4 className="text-xl font-black tracking-tighter text-slate-800 uppercase">
                  Chỉ định thuốc
                </h4>
              </div>
              <div className="flex min-h-[140px] items-center justify-center rounded-[24px] border border-orange-100 bg-orange-50/50 p-8">
                <p className="text-center text-2xl font-black tracking-tight text-slate-800 italic">
                  {protocol.prescription}
                </p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-black text-slate-300 uppercase italic">
                  Ghi chú: {protocol.notes || "Không có"}
                </p>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent
          value="history"
          className="animate-in slide-in-from-bottom-4 duration-500"
        >
          <div className="mb-10 flex items-center justify-between">
            <h3 className="text-2xl font-black tracking-tighter text-slate-800 uppercase">
              Dòng thời gian sự kiện
            </h3>
            <AddEventModal protocolId={id} onEventAdded={fetchEvents} />
          </div>
          <div className="relative space-y-12 before:absolute before:inset-0 before:ml-5 before:h-full before:w-1 before:bg-slate-100 md:before:mx-auto md:before:translate-x-0">
            {events.length === 0 ? (
              <div className="rounded-[32px] border-2 border-dashed border-slate-100 bg-white py-24 text-center">
                <p className="font-black tracking-widest text-slate-300 uppercase italic">
                  Chưa có dữ liệu nhật ký sự kiện
                </p>
              </div>
            ) : (
              events.map((event) => (
                <div
                  key={event.id}
                  className="group relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse"
                >
                  <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-4 border-slate-50 bg-slate-900 text-white shadow-xl transition-all group-hover:scale-110 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                    <HiOutlineClock size={18} />
                  </div>
                  <div className="w-[calc(100%-4.5rem)] rounded-[32px] border border-slate-50 bg-white p-8 shadow-sm transition-all hover:shadow-lg md:w-[45%]">
                    <div className="mb-3 flex items-center justify-between">
                      <time className="flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-[10px] font-black text-blue-600 uppercase italic">
                        <HiOutlineCalendar size={14} />{" "}
                        {new Date(event.event_date).toLocaleString("vi-VN")}
                      </time>
                      <Badge className="border-none bg-slate-900 px-3 text-[9px] font-black text-white uppercase">
                        {event.event_type}
                      </Badge>
                    </div>
                    <p className="text-sm font-black tracking-tight text-slate-700 uppercase">
                      {event.description}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>

        {/* TAB XÉT NGHIỆM (LAB)*/}
        <TabsContent
          value="lab"
          className="animate-in slide-in-from-bottom-4 space-y-6 duration-500"
        >
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-2xl font-black tracking-tighter text-slate-800 uppercase">
              Phân tích kết quả xét nghiệm
            </h3>
            <Button className="h-12 rounded-2xl bg-blue-600 px-6 text-[10px] font-black tracking-widest text-white uppercase shadow-lg shadow-blue-100">
              NHẬP KẾT QUẢ MỚI
            </Button>
          </div>

          <Card className="rounded-[32px] border-none bg-white p-6 shadow-sm">
            {labResults.length > 0 ? (
              <HormoneChart data={labResults} />
            ) : (
              <div className="flex h-[300px] items-center justify-center font-bold tracking-widest text-slate-300 uppercase italic">
                Cần ít nhất 1 kết quả để hiển thị biểu đồ
              </div>
            )}
          </Card>

          <Card className="overflow-hidden rounded-[32px] border-none bg-white shadow-sm">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="p-6 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Ngày XN
                  </TableHead>
                  <TableHead className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Loại xét nghiệm
                  </TableHead>
                  <TableHead className="text-center text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Giá trị
                  </TableHead>
                  <TableHead className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Đơn vị
                  </TableHead>
                  <TableHead className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Ghi chú lâm sàng
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {labResults.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-10 text-center font-black text-slate-300 uppercase italic"
                    >
                      Chưa có bản ghi xét nghiệm nào
                    </TableCell>
                  </TableRow>
                ) : (
                  labResults.map((lab) => (
                    <TableRow
                      key={lab.id}
                      className="border-b border-slate-50 transition-colors hover:bg-slate-50/50"
                    >
                      <TableCell className="p-6 text-xs font-bold tracking-tighter text-slate-500 uppercase">
                        {lab.test_date_formatted}
                      </TableCell>
                      <TableCell>
                        <Badge className="border-none bg-blue-50 px-3 py-1 text-[9px] font-black text-blue-600 uppercase">
                          {lab.test_type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-lg font-black text-slate-800">
                          {lab.result_data[0]}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs font-black text-slate-400 uppercase">
                        {lab.unit}
                      </TableCell>
                      <TableCell className="max-w-[300px] text-xs leading-relaxed font-medium text-slate-500 italic">
                        {lab.doctor_notes || "---"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent
          value="schedule"
          className="animate-in slide-in-from-bottom-4 space-y-6 duration-500"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black tracking-tighter text-slate-800 uppercase">
              Kế hoạch dùng thuốc
            </h3>
            <Button className="h-12 rounded-2xl bg-slate-900 px-6 text-[10px] font-black tracking-widest text-white uppercase shadow-xl">
              THÊM LỊCH MỚI
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {schedules.length === 0 ? (
              <div className="col-span-2 rounded-[32px] border-2 border-dashed border-slate-200 bg-white py-24 text-center font-black tracking-widest text-slate-300 uppercase italic">
                Chưa có lịch thuốc
              </div>
            ) : (
              schedules.map((item) => (
                <Card
                  key={item.id}
                  className="group overflow-hidden rounded-[32px] border-none bg-white shadow-sm transition-all hover:shadow-md"
                >
                  <div className="space-y-5 p-7">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="rounded-2xl bg-blue-50 p-4 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                          {item.route === "oral" ? (
                            <LuTablets size={26} />
                          ) : (
                            <LuSyringe size={26} />
                          )}
                        </div>
                        <div>
                          <h4 className="text-lg leading-none font-black text-slate-800 uppercase">
                            {item.medication_name}
                          </h4>
                          <Badge
                            variant="outline"
                            className="mt-2 border-slate-200 text-[9px] font-bold tracking-tighter text-slate-400 uppercase"
                          >
                            ĐƯỜNG {item.route.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      <Badge className="rounded-lg border-none bg-green-100 px-3 py-1 text-[9px] font-black text-green-700">
                        ACTIVE
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="mb-1 text-[9px] font-black tracking-widest text-slate-400 uppercase">
                          Liều lượng
                        </p>
                        <p className="text-sm font-black text-slate-800 uppercase italic">
                          {item.dosage}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="mb-1 text-[9px] font-black tracking-widest text-slate-400 uppercase">
                          Tần suất
                        </p>
                        <p className="text-sm font-black text-slate-800 uppercase italic">
                          {item.frequency} lần / ngày
                        </p>
                      </div>
                    </div>

                    <div className="rounded-[24px] border border-blue-100 bg-blue-50/50 p-5">
                      <p className="mb-3 flex items-center gap-2 text-[9px] font-black tracking-widest text-blue-400 uppercase">
                        <HiOutlineClock size={14} /> KHUNG GIỜ
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {item.time_slots.map((slot, idx) => (
                          <span
                            key={idx}
                            className="rounded-xl border border-blue-200 bg-white px-4 py-1.5 text-[10px] font-black text-blue-700 uppercase shadow-sm"
                          >
                            {slot}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                      <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                        <HiOutlineCalendar
                          size={16}
                          className="text-blue-600"
                        />
                        <span>
                          {item.start_date} → {item.end_date}
                        </span>
                      </div>
                      <FaCapsules size={20} className="text-slate-200" />
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProtocolDetail;
