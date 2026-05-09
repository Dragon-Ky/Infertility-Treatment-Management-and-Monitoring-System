import { useEffect, useState } from "react";
import AddScheduleModal from "@/components/AddScheduleModal";
import AddRecordModal from "@/components/AddRecordModal";
import DeleteConfirm from "@/components/DeleteConfirm";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useProtocolData } from "@/contexts/ProtocolContext";
import {
  getMedicationRecords,
  deleteMedicationRecord,
} from "@/services/recordService";
import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineTrash,
} from "react-icons/hi";
import { LuSyringe, LuTablets } from "react-icons/lu";
import {
  BsFillPatchCheckFill,
  BsFillPatchMinusFill,
  BsFillXCircleFill,
} from "react-icons/bs";
import toast from "react-hot-toast";

// Hiển thị danh sách lịch sử uống của 1 loại thuốc
const RecordList = ({ scheduleId }) => {
  const [records, setRecords] = useState([]);

  const fetchRecords = async () => {
    try {
      const res = await getMedicationRecords(scheduleId);
      // Lọc record theo đúng ID lịch thuốc này
      const filtered = (res.data || []).filter(
        (r) => r.medication_schedule_id === scheduleId,
      );

      setRecords(
        filtered.sort(
          (a, b) => new Date(b.actual_time) - new Date(a.actual_time),
        ),
      );
    } catch (error) {
      console.error("Lỗi tải record:", error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRecords();
  }, [scheduleId]);

  const handleDeleteRecord = async (id) => {
    try {
      await deleteMedicationRecord(id);
      fetchRecords();
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error("Không thể xóa record");
    }
  };

  const getStatusIcon = (status) => {
    if (status === "taken")
      return <BsFillPatchCheckFill className="text-green-500" size={14} />;
    if (status === "missed")
      return <BsFillXCircleFill className="text-red-500" size={14} />;
    return <BsFillPatchMinusFill className="text-slate-400" size={14} />;
  };

  return (
    <div className="mt-4 space-y-2 border-t border-slate-50 pt-4">
      <AddRecordModal schedule={{ id: scheduleId }} onAdded={fetchRecords} />

      <div className="mt-4 flex items-center justify-between">
        <p className="text-[9px] font-black tracking-widest text-slate-400 uppercase">
          Lịch sử sử dụng
        </p>
      </div>

      {records.length === 0 ? (
        <p className="text-[10px] font-bold text-slate-300 italic">
          Chưa có ghi nhận nào.
        </p>
      ) : (
        <div className="max-h-[120px] space-y-2 overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-200">
          {records.map((record) => (
            <div
              key={record.id}
              className="group flex items-center justify-between rounded-xl bg-slate-50 p-2 px-3 transition-colors hover:bg-slate-100"
            >
              <div className="flex items-center gap-2">
                {getStatusIcon(record.status)}
                <span className="text-[10px] font-bold text-slate-600">
                  {record.actual_time.substring(0, 16).replace("T", " ")}
                </span>
              </div>
              <button
                onClick={() => handleDeleteRecord(record.id)}
                className="text-slate-300 opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-500"
              >
                <HiOutlineTrash size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

function ScheduleTab() {
  const { schedules, protocol, fetchSchedules, handleDeleteSchedule } =
    useProtocolData();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-black tracking-tighter text-slate-800 uppercase">
          Kế hoạch & Xác nhận dùng thuốc
        </h3>
        <AddScheduleModal protocolId={protocol?.id} onAdded={fetchSchedules} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {schedules.length === 0 ? (
          <div className="col-span-full rounded-[32px] border-2 border-dashed border-slate-200 bg-white py-24 text-center font-black tracking-widest text-slate-300 uppercase italic">
            Chưa có lịch thuốc
          </div>
        ) : (
          schedules.map((item) => (
            <Card
              key={item.id}
              className="group relative flex h-full flex-col overflow-hidden rounded-[32px] border-none bg-white shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex-1 space-y-5 p-7 pb-4">
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
                      {item.frequency} LẦN/NGÀY
                    </p>
                  </div>
                </div>

                <div className="rounded-[24px] border border-blue-100 bg-blue-50/50 p-5">
                  <p className="mb-3 flex items-center gap-2 text-[9px] font-black tracking-widest text-blue-400 uppercase">
                    <HiOutlineClock size={14} /> KHUNG GIỜ CẦN UỐNG
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {item.time_slots?.map((slot, idx) => (
                      <span
                        key={idx}
                        className="rounded-xl border border-blue-200 bg-white px-4 py-1.5 text-[10px] font-black text-blue-700 uppercase shadow-sm"
                      >
                        {slot}
                      </span>
                    ))}
                  </div>
                </div>

                <RecordList scheduleId={item.id} />
              </div>

              <div className="mt-auto flex items-center justify-between border-t border-slate-100 bg-slate-50 p-4 px-7">
                <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  <HiOutlineCalendar size={16} className="text-blue-600" />
                  <span>
                    {item.start_date} → {item.end_date}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <AddScheduleModal
                    protocolId={protocol?.id}
                    onAdded={fetchSchedules}
                    editData={item}
                  />
                  <DeleteConfirm
                    description="lịch dùng thuốc"
                    onConfirm={() => handleDeleteSchedule(item.id)}
                  />
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

export default ScheduleTab;
