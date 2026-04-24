import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { HiOutlineChevronLeft } from "react-icons/hi";

function ProtocolHeader({ protocol }) {
  const navigate = useNavigate();

  return (
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
            Phác đồ <span className="text-blue-600">#{protocol.id}</span>
          </h1>
          <p className="text-[10px] leading-none font-black tracking-[0.2em] text-slate-400 uppercase">
            Ngày tạo: {protocol.created_at}
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
  );
}

export default ProtocolHeader;
