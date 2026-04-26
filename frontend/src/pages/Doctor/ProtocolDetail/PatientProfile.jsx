import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  HiOutlineUser,
  HiOutlineBeaker,
  HiOutlineIdentification,
  HiOutlineHashtag,
} from "react-icons/hi";

function PatientProfile({ protocol, customer }) {
  // Lấy thông tin bác sĩ
  const userStr = localStorage.getItem("user");
  const currentUser = userStr ? JSON.parse(userStr) : null;

  // Ưu tiên: Từ API trả về > Tên user đang login > "Bác sĩ #[ID]"
  const doctorName =
    protocol.doctor_name ||
    (currentUser?.id === protocol.doctor_id
      ? currentUser.name
      : `BS. #${protocol.doctor_id}`);

  return (
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
              {customer?.email || "N/A"} - {customer?.phone || "N/A"}
            </p>
            <div className="flex items-center gap-2 pt-2">
              <div className="flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1 text-[10px] font-black text-blue-500 uppercase">
                <HiOutlineHashtag size={14} /> ID: {protocol.treatment_id}
              </div>

              <div className="flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1 text-[10px] font-black text-slate-400 uppercase">
                <HiOutlineUser size={14} /> {doctorName}
              </div>
            </div>
          </div>
        </div>
      </Card>
      <Card className="group relative overflow-hidden rounded-[32px] border-none bg-blue-600 p-8 text-white shadow-xl">
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
  );
}

export default PatientProfile;
