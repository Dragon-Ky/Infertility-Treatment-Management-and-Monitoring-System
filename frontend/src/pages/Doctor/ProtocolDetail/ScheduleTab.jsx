import AddScheduleModal from "@/components/AddScheduleModal";
import DeleteConfirm from "@/components/DeleteConfirm";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useProtocolData } from "@/contexts/ProtocolContext";
import { FaCapsules } from "react-icons/fa6";
import { HiOutlineCalendar, HiOutlineClock } from "react-icons/hi";
import { LuSyringe, LuTablets } from "react-icons/lu";

function ScheduleTab() {
  const { schedules, protocol, fetchSchedules, handleDeleteSchedule } =
    useProtocolData();

  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-black tracking-tighter text-slate-800 uppercase">
          Kế hoạch dùng thuốc
        </h3>
        <AddScheduleModal protocolId={protocol?.id} onAdded={fetchSchedules} />
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
              className="group relative overflow-hidden rounded-[32px] border-none bg-white shadow-sm transition-all hover:shadow-md"
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
                    <HiOutlineCalendar size={16} className="text-blue-600" />
                    <span>
                      {item.start_date} → {item.end_date}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <AddScheduleModal
                      protocolId={protocol?.id}
                      onAdded={fetchSchedules}
                      editData={item}
                    />

                    <DeleteConfirm
                      description="lịch dùng thuốc"
                      onConfirm={() => handleDeleteSchedule(item.id)}
                    />
                    <FaCapsules size={20} className="text-slate-200" />
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </>
  );
}

export default ScheduleTab;
