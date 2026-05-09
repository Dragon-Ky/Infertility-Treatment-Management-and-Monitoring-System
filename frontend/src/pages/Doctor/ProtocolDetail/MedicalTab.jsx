import { Card } from "@/components/ui/card";
import { useProtocolData } from "@/contexts/ProtocolContext";
import { HiOutlineBeaker, HiOutlineClipboardCheck } from "react-icons/hi";
import AddMedicalProtocolModal from "@/components/AddProtocolModal";

function MedicalTab() {
  const { protocol, fetchFullData } = useProtocolData();

  return (
    <>
      <div className="mb-10 flex items-center justify-between">
        <h3 className="text-2xl font-black tracking-tighter text-slate-800 uppercase">
          Thông tin hồ sơ y tế
        </h3>

        <AddMedicalProtocolModal editData={protocol} onAdded={fetchFullData} />
      </div>

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
                {protocol?.protocol_name || "---"}
              </p>
            </div>
            <div className="rounded-[24px] bg-slate-50 p-6">
              <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                Nội dung bệnh lý
              </label>
              <p className="font-bold text-slate-600 italic">
                "{protocol?.diagnosis || "Chưa có dữ liệu chẩn đoán"}"
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
              {protocol?.prescription || "Trống"}
            </p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-black text-slate-300 uppercase italic">
              Ghi chú: {protocol?.notes || "Không có"}
            </p>
          </div>
        </Card>
      </div>
    </>
  );
}

export default MedicalTab;
