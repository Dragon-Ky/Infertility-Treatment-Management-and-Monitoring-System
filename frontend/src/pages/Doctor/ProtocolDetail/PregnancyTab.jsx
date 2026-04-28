import { useEffect, useState } from "react";
import { useProtocolData } from "@/contexts/ProtocolContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TbBabyCarriage } from "react-icons/tb";
import { HiOutlineCalendar } from "react-icons/hi";
import {
  getPregnancyTrackings,
  deletePregnancyTracking,
} from "@/services/pregnancyService";
import DeleteConfirm from "@/components/DeleteConfirm";
import AddPregnancyModal from "@/components/AddPregnancyModal";
import toast from "react-hot-toast";

function PregnancyTab() {
  const { id: protocolId } = useProtocolData();
  const [trackings, setTrackings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTrackings = async () => {
    try {
      const res = await getPregnancyTrackings(protocolId);
      const sorted = (res.data || []).sort(
        (a, b) => b.week_number - a.week_number,
      );
      setTrackings(sorted);
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error("Không thể tải dữ liệu thai kỳ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrackings();
  }, [protocolId]);

  const handleDelete = async (trackingId) => {
    try {
      await deletePregnancyTracking(trackingId);
      toast.success("Đã xóa mốc khám thai");
      fetchTrackings();
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error("Lỗi khi xóa");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "ongoing":
        return "bg-blue-100 text-blue-700";
      case "delivered":
        return "bg-green-100 text-green-700";
      case "miscarried":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getTimelineNodeColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-500 shadow-green-200";
      case "miscarried":
        return "bg-red-500 shadow-red-200";
      default:
        return "bg-pink-500 shadow-pink-200";
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center font-black text-slate-400">
        ĐANG TẢI DỮ LIỆU...
      </div>
    );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-black tracking-tighter text-slate-800 uppercase">
          Hành trình Thai kỳ
        </h3>
        <AddPregnancyModal onAdded={fetchTrackings} />
      </div>

      {trackings.length === 0 ? (
        <div className="rounded-[32px] border-2 border-dashed border-pink-200 bg-pink-50/50 py-24 text-center font-black tracking-widest text-pink-300 uppercase italic">
          CHƯA CÓ DỮ LIỆU KHÁM THAI
        </div>
      ) : (
        <div className="relative ml-4 py-4 md:ml-8">
          {/* Đường dọc Timeline */}
          <div className="absolute top-0 bottom-0 left-0 w-1 rounded-full bg-pink-100"></div>

          <div className="space-y-12">
            {trackings.map((item) => (
              <div key={item.id} className="group relative pl-10 md:pl-16">
                {/* Vòng tròn điểm neo Timeline */}
                <div
                  className={`absolute top-6 -left-[18px] flex h-10 w-10 items-center justify-center rounded-full text-white shadow-lg ring-4 ring-slate-50 transition-all duration-300 group-hover:scale-125 ${getTimelineNodeColor(item.status)}`}
                >
                  <TbBabyCarriage size={20} />
                </div>

                <Card className="relative overflow-hidden rounded-[32px] border-none bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-100/50">
                  <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h4 className="text-2xl leading-none font-black text-slate-800 uppercase">
                        Tuần thai thứ {item.week_number}
                      </h4>
                      <div className="mt-2 flex items-center gap-2 text-[11px] font-black tracking-widest text-pink-400 uppercase">
                        <HiOutlineCalendar size={16} />
                        Ngày ghi nhận: {item.tracking_date_formatted}
                      </div>
                    </div>
                    <Badge
                      className={`border-none px-4 py-1.5 text-[10px] font-black uppercase shadow-sm ${getStatusStyle(item.status)}`}
                    >
                      {item.status_label}
                    </Badge>
                  </div>

                  {item.notes && (
                    <div className="min-h-[80px] rounded-2xl border border-slate-100 bg-slate-50 p-5">
                      <p className="mb-2 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                        Chỉ số & Kết quả Siêu âm
                      </p>
                      <p className="text-sm leading-relaxed font-semibold whitespace-pre-wrap text-slate-700">
                        {item.notes}
                      </p>
                    </div>
                  )}

                  <div className="mt-6 flex items-center justify-between border-t border-slate-50 pt-5">
                    <div className="flex gap-3">
                      <AddPregnancyModal
                        editData={item}
                        onAdded={fetchTrackings}
                      />
                      <DeleteConfirm
                        description={`mốc thai tuần ${item.week_number}`}
                        onConfirm={() => handleDelete(item.id)}
                      />
                    </div>

                    <span className="text-[10px] font-bold tracking-widest text-slate-300 uppercase italic">
                      Medicen Pregnancy
                    </span>
                  </div>
                </Card>
              </div>
            ))}
          </div>

          <div className="relative mt-12 pl-10 opacity-50 md:pl-16">
            <div className="absolute top-1 -left-[14px] h-8 w-8 rounded-full border-4 border-pink-200 bg-slate-50"></div>
            <p className="text-xs font-black tracking-widest text-slate-400 uppercase italic">
              Bắt đầu theo dõi thai kỳ (Embryo Transfer)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default PregnancyTab;
