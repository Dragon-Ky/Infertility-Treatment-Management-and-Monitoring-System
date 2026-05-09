import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { getProtocolDetail, updateProtocol } from "@/services/protocolService";
import { getCustomers } from "@/services/doctorService";
import { getEventsByProtocol, deleteEvent } from "@/services/eventService";
import { getLabResults, deleteLabResult } from "@/services/labService";
import {
  getMedicationSchedules,
  deleteMedicationSchedule,
} from "@/services/scheduleService";
import {
  getSpecimensByProtocol,
  deleteSpecimen,
} from "@/services/specimenService";
import { getStorageByProtocol } from "@/services/storageService";
import { getDoctors } from "@/services/managerService";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { HiCheckCircle, HiOutlineShieldCheck } from "react-icons/hi";
import toast from "react-hot-toast";
import ProtocolHeader from "./ProtocolHeader";
import PatientProfile from "./PatientProfile";
import MedicalTab from "./MedicalTab";
import HistoryTab from "./HistoryTab";
import LabTab from "./LabTab";
import ScheduleTab from "./ScheduleTab";
import SpecimenTab from "./SpecimenTab";
import StorageTab from "./StorageTab";
import PregnancyTab from "./PregnancyTab";
import { ProtocolProvider } from "@/contexts/ProtocolContext";

const ProtocolDetail = () => {
  const { id } = useParams();
  const [protocol, setProtocol] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [events, setEvents] = useState([]);
  const [labResults, setLabResults] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [specimens, setSpecimens] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isCompleting, setIsCompleting] = useState(false);

  const fetchFullData = useCallback(async () => {
    try {
      const [
        protocolRes,
        eventsRes,
        customerRes,
        labRes,
        scheduleRes,
        specimenRes,
        storageRes,
        doctorsRes,
      ] = await Promise.all([
        getProtocolDetail(id),
        getEventsByProtocol(id),
        getCustomers(),
        getLabResults(id),
        getMedicationSchedules(id),
        getSpecimensByProtocol(id),
        getStorageByProtocol(id),
        getDoctors(),
      ]);

      const pData = protocolRes.data;
      setEvents(eventsRes.data || []);
      setLabResults(labRes.data || []);
      setSchedules(scheduleRes.data || []);

      const storageData = storageRes.data || storageRes || [];
      const rawSpecimens = specimenRes.data || [];

      const specimensWithStorage = rawSpecimens.map((specimen) => {
        const matchedStorage = storageData.find(
          (st) => String(st.item_id) === String(specimen.id),
        );
        return {
          ...specimen,
          storage: matchedStorage || null,
        };
      });

      setSpecimens(specimensWithStorage);

      if (pData) {
        const doctorsData = doctorsRes.data || doctorsRes || [];
        const foundDoctor = doctorsData.find(
          (d) => String(d.id) === String(pData.doctor_id),
        );
        setDoctor(foundDoctor);

        pData.doctor_name =
          foundDoctor?.name || `Bác sĩ ID: ${pData.doctor_id}`;
        pData.doctor_phone = foundDoctor?.phone || "";

        const targetId = pData.treatment_id || pData.customer_id;
        const foundCustomer = customerRes.data.find(
          (c) => String(c.id) === String(targetId),
        );
        setCustomer(foundCustomer);
      }

      setProtocol(pData);
    } catch (error) {
      console.error("Lỗi đồng bộ:", error);
      toast.error("Lỗi đồng bộ Medicen!");
    }
  }, [id]);

  const fetchEvents = async () => {
    try {
      const res = await getEventsByProtocol(id);
      setEvents(res.data || []);
    } catch (error) {
      console.error("Lỗi tải sự kiện:", error);
    }
  };

  const fetchLabResults = async () => {
    try {
      const res = await getLabResults(id);
      setLabResults(res.data || []);
    } catch (error) {
      console.error("Lỗi tải kết quả xét nghiệm:", error);
    }
  };

  const fetchSchedules = async () => {
    try {
      const res = await getMedicationSchedules(id);
      setSchedules(res.data || []);
    } catch (error) {
      console.error("Lỗi tải lịch thuốc:", error);
    }
  };

  const fetchSpecimens = async () => {
    try {
      const [specimenRes, storageRes] = await Promise.all([
        getSpecimensByProtocol(id),
        getStorageByProtocol(id),
      ]);

      const storageData = storageRes.data || storageRes || [];
      const specimensWithStorage = (specimenRes.data || []).map((specimen) => {
        const matchedStorage = storageData.find(
          (st) => String(st.item_id) === String(specimen.id),
        );
        return { ...specimen, storage: matchedStorage || null };
      });

      setSpecimens(specimensWithStorage);
    } catch (error) {
      console.error("Lỗi tải mẫu phẩm:", error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await deleteEvent(eventId);
      toast.success("Đã xóa sự kiện!");
      fetchEvents();
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error("Không thể xóa sự kiện!");
    }
  };

  const handleDeleteLab = async (labId) => {
    try {
      await deleteLabResult(labId);
      toast.success("Đã xóa bản ghi!");
      fetchLabResults();
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error("Không thể xóa!");
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    try {
      await deleteMedicationSchedule(scheduleId);
      toast.success("Đã xóa lịch thuốc!");
      fetchSchedules();
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error("Không thể xóa!");
    }
  };

  const handleDeleteSpecimen = async (specimenId) => {
    try {
      await deleteSpecimen(specimenId);
      toast.success("Đã xóa mẫu phẩm!");
      fetchSpecimens();
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error("Không thể xóa mẫu phẩm!");
    }
  };

  const handleMarkAsCompleted = async () => {
    try {
      setIsCompleting(true);
      await updateProtocol(protocol.id, { status: "completed" });
      toast.success("Tuyệt vời! Ca điều trị đã được ghi nhận hoàn thành.");
      await fetchFullData();
    } catch (error) {
      console.error(error);
      toast.error("Đã xảy ra lỗi khi cập nhật trạng thái!");
    } finally {
      setIsCompleting(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchFullData();
      setTimeout(() => setLoading(false), 600);
    };
    init();
  }, [fetchFullData]);

  if (loading)
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-(--primaryCustom) border-t-transparent"></div>
        <p className="animate-pulse text-[10px] font-black tracking-widest text-slate-400 uppercase">
          Đang đồng bộ hồ sơ...
        </p>
      </div>
    );

  if (!protocol)
    return (
      <div className="p-10 text-center font-black text-slate-400">
        DỮ LIỆU KHÔNG TỒN TẠI
      </div>
    );

  const contextValue = {
    id,
    protocol,
    customer,
    doctor,
    events,
    labResults,
    schedules,
    specimens,
    fetchEvents,
    fetchLabResults,
    fetchSchedules,
    fetchSpecimens,
    fetchFullData,
    handleDeleteEvent,
    handleDeleteLab,
    handleDeleteSchedule,
    handleDeleteSpecimen,
  };

  const isProtocolCompleted = protocol.status === "completed";

  return (
    <ProtocolProvider value={contextValue}>
      <div className="animate-in fade-in zoom-in-95 min-h-screen space-y-6 bg-slate-50 p-6 duration-500">
        <ProtocolHeader protocol={protocol} onUpdated={fetchFullData} />
        <PatientProfile protocol={protocol} customer={customer} />

        <div className="flex flex-col items-center justify-between rounded-[24px] border border-slate-100 bg-white p-5 shadow-sm sm:flex-row">
          <div className="flex items-center gap-4">
            <span className="text-[11px] font-black tracking-widest text-slate-400 uppercase">
              Trạng Thái Hồ Sơ:
            </span>
            {isProtocolCompleted ? (
              <Badge className="rounded-xl border-none bg-purple-100 px-4 py-2 font-black tracking-widest text-purple-700 shadow-none">
                <HiCheckCircle className="mr-1.5 inline h-4 w-4" /> ĐÃ HOÀN
                THÀNH ĐIỀU TRỊ
              </Badge>
            ) : (
              <Badge className="rounded-xl border-none bg-green-100 px-4 py-2 font-black tracking-widest text-green-700 shadow-none">
                <AiOutlineLoading3Quarters className="mr-2 inline h-3 w-3 animate-spin" />{" "}
                ĐANG TRONG LỘ TRÌNH
              </Badge>
            )}
          </div>

          {!isProtocolCompleted && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  disabled={isCompleting}
                  className="mt-4 h-11 cursor-pointer rounded-xl bg-purple-600 px-6 font-black tracking-widest text-white shadow-md shadow-purple-200 transition-all hover:-translate-y-0.5 hover:bg-purple-700 sm:mt-0"
                >
                  {isCompleting ? (
                    <>
                      <AiOutlineLoading3Quarters className="mr-2 h-4 w-4 animate-spin" />{" "}
                      ĐANG XỬ LÝ...
                    </>
                  ) : (
                    <>
                      <HiOutlineShieldCheck className="mr-2 h-5 w-5" /> CHỐT HỒ
                      SƠ - HOÀN THÀNH
                    </>
                  )}
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent className="rounded-[24px] border-none shadow-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-xl font-black text-slate-800">
                    Xác nhận hoàn tất điều trị?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="font-medium text-slate-500">
                    <div className="mb-4">
                      Hành động này sẽ chốt hồ sơ và chuyển trạng thái phác đồ
                      sang{" "}
                      <span className="font-bold text-purple-600">
                        "Đã hoàn thành"
                      </span>
                      . Bạn có chắc chắn bệnh nhân đã kết thúc lộ trình điều trị
                      hoặc đã đậu thai thành công không?
                    </div>

                    <div className="mt-2 flex flex-col items-center justify-center rounded-2xl border border-purple-100 bg-purple-50 p-4">
                      <span className="mb-1 text-[10px] font-black tracking-widest text-purple-400 uppercase">
                        Doanh Thu Ghi Nhận Cho Ca Này
                      </span>
                      <span className="text-2xl font-black text-purple-700">
                        {new Intl.NumberFormat("vi-VN").format(
                          protocol?.price || 0,
                        )}{" "}
                        VNĐ
                      </span>
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-4">
                  <AlertDialogCancel className="rounded-xl border-slate-200 font-bold text-slate-500 hover:bg-slate-50">
                    Hủy bỏ
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleMarkAsCompleted}
                    className="rounded-xl bg-purple-600 font-bold text-white shadow-lg shadow-purple-200 transition-all hover:-translate-y-0.5 hover:bg-purple-700"
                  >
                    Xác nhận Hoàn thành
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        <Tabs defaultValue="medical" className="space-y-6">
          <div className="flex w-full overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden">
            <TabsList className="mx-auto inline-flex h-auto min-h-[64px] w-max gap-2 rounded-[24px] bg-white p-2 shadow-sm">
              <TabsTrigger
                value="medical"
                className="h-12 rounded-xl px-8 text-[10px] font-black tracking-widest uppercase data-[state=active]:bg-(--primaryCustom) data-[state=active]:text-white"
              >
                HỒ SƠ Y TẾ
              </TabsTrigger>

              <TabsTrigger
                value="schedule"
                className="h-12 rounded-xl px-8 text-[10px] font-black tracking-widest uppercase data-[state=active]:bg-(--primaryCustom) data-[state=active]:text-white"
              >
                LỊCH THUỐC
              </TabsTrigger>

              <TabsTrigger
                value="lab"
                className="h-12 rounded-xl px-8 text-[10px] font-black tracking-widest uppercase data-[state=active]:bg-(--primaryCustom) data-[state=active]:text-white"
              >
                XÉT NGHIỆM (LAB)
              </TabsTrigger>

              <TabsTrigger
                value="specimens"
                className="h-12 rounded-xl px-8 text-[10px] font-black tracking-widest uppercase data-[state=active]:bg-(--primaryCustom) data-[state=active]:text-white"
              >
                MẪU PHẨM (SPECIMENS)
              </TabsTrigger>

              <TabsTrigger
                value="storage"
                className="h-12 rounded-xl px-8 text-[10px] font-black tracking-widest uppercase data-[state=active]:bg-(--primaryCustom) data-[state=active]:text-white"
              >
                LƯU TRỮ (STORAGE)
              </TabsTrigger>

              <TabsTrigger
                value="pregnancy"
                className="h-12 rounded-xl px-8 text-[10px] font-black tracking-widest uppercase data-[state=active]:bg-pink-500 data-[state=active]:text-white"
              >
                THAI KỲ (PREGNANCY)
              </TabsTrigger>

              <TabsTrigger
                value="history"
                className="h-12 rounded-xl px-8 text-[10px] font-black tracking-widest uppercase data-[state=active]:bg-(--primaryCustom) data-[state=active]:text-white"
              >
                NHẬT KÝ (EVENTS)
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent
            value="medical"
            className="animate-in slide-in-from-bottom-4 duration-500"
          >
            <MedicalTab />
          </TabsContent>

          <TabsContent
            value="schedule"
            className="animate-in slide-in-from-bottom-4 space-y-6 duration-500"
          >
            <ScheduleTab />
          </TabsContent>

          <TabsContent
            value="lab"
            className="animate-in slide-in-from-bottom-4 space-y-6 duration-500"
          >
            <LabTab />
          </TabsContent>

          <TabsContent
            value="specimens"
            className="animate-in slide-in-from-bottom-4 duration-500"
          >
            <SpecimenTab />
          </TabsContent>

          <TabsContent
            value="storage"
            className="animate-in slide-in-from-bottom-4 duration-500"
          >
            <StorageTab />
          </TabsContent>

          <TabsContent
            value="pregnancy"
            className="animate-in slide-in-from-bottom-4 duration-500"
          >
            <PregnancyTab />
          </TabsContent>

          <TabsContent
            value="history"
            className="animate-in slide-in-from-bottom-4 duration-500"
          >
            <HistoryTab />
          </TabsContent>
        </Tabs>
      </div>
    </ProtocolProvider>
  );
};

export default ProtocolDetail;
