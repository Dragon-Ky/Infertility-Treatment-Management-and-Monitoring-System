import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { getProtocolDetail } from "@/services/protocolService";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const [events, setEvents] = useState([]);
  const [labResults, setLabResults] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [specimens, setSpecimens] = useState([]);
  const [loading, setLoading] = useState(true);

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
      ] = await Promise.all([
        getProtocolDetail(id),
        getEventsByProtocol(id),
        getCustomers(),
        getLabResults(id),
        getMedicationSchedules(id),
        getSpecimensByProtocol(id),
        getStorageByProtocol(id),
      ]);

      const pData = protocolRes.data;
      setProtocol(pData);
      setEvents(eventsRes.data || []);
      setLabResults(labRes.data || []);
      setSchedules(scheduleRes.data || []);

      //Tự động Join dữ liệu vào storage
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
        const targetId = pData.treatment_id || pData.customer_id;
        const foundCustomer = customerRes.data.find(
          (c) => String(c.id) === String(targetId),
        );
        setCustomer(foundCustomer);
      }
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

  // Cập nhật hàm Fetch Specimens để tự join dữ liệu
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

  //Hàm xử lí xóa
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

  //Khởi tạo dữ liệu
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
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
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

  return (
    <ProtocolProvider value={contextValue}>
      <div className="animate-in fade-in zoom-in-95 min-h-screen space-y-6 bg-slate-50 p-6 duration-500">
        <ProtocolHeader protocol={protocol} onUpdated={fetchFullData} />
        <PatientProfile protocol={protocol} customer={customer} />

        <Tabs defaultValue="medical" className="space-y-6">
          <div className="flex w-full overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden">
            <TabsList className="mx-auto inline-flex h-auto min-h-[64px] w-max gap-2 rounded-[24px] bg-white p-2 shadow-sm">
              <TabsTrigger
                value="medical"
                className="h-12 rounded-xl px-8 text-[10px] font-black tracking-widest uppercase data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                HỒ SƠ Y TẾ
              </TabsTrigger>

              <TabsTrigger
                value="schedule"
                className="h-12 rounded-xl px-8 text-[10px] font-black tracking-widest uppercase data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                LỊCH THUỐC
              </TabsTrigger>

              <TabsTrigger
                value="lab"
                className="h-12 rounded-xl px-8 text-[10px] font-black tracking-widest uppercase data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                XÉT NGHIỆM (LAB)
              </TabsTrigger>

              <TabsTrigger
                value="specimens"
                className="h-12 rounded-xl px-8 text-[10px] font-black tracking-widest uppercase data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                MẪU PHẨM (SPECIMENS)
              </TabsTrigger>

              <TabsTrigger
                value="storage"
                className="h-12 rounded-xl px-8 text-[10px] font-black tracking-widest uppercase data-[state=active]:bg-blue-600 data-[state=active]:text-white"
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
                className="h-12 rounded-xl px-8 text-[10px] font-black tracking-widest uppercase data-[state=active]:bg-blue-600 data-[state=active]:text-white"
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
