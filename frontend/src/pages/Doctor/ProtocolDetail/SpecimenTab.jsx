import { useProtocolData } from "@/contexts/ProtocolContext";
import AddSpecimenModal from "@/components/AddSpecimenModal";
import DeleteConfirm from "@/components/DeleteConfirm";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { HiOutlineDatabase, HiOutlineBeaker } from "react-icons/hi";
import { LuZap, LuCircleDot, LuDna } from "react-icons/lu";

function SpecimenTab() {
  const { id, specimens, fetchSpecimens, handleDeleteSpecimen } =
    useProtocolData();

  const getSpecimenIcon = (type) => {
    switch (type) {
      case "egg":
        return <LuCircleDot size={26} className="text-pink-500" />;
      case "sperm":
        return <LuZap size={26} className="text-blue-500" />;
      case "embryo":
        return <LuDna size={26} className="text-purple-500" />;
      default:
        return <HiOutlineDatabase size={26} className="text-slate-400" />;
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      fresh: "bg-green-100 text-green-700",
      frozen: "bg-blue-100 text-blue-700",
      used: "bg-slate-100 text-slate-600",
      discarded: "bg-red-100 text-red-700",
    };
    return (
      <Badge
        className={`border-none px-2 py-0.5 text-[9px] font-black uppercase ${config[status]}`}
      >
        {status}
      </Badge>
    );
  };

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <h3 className="text-2xl font-black tracking-tighter text-slate-800 uppercase">
          Quản lý mẫu phẩm (Specimens)
        </h3>
        <AddSpecimenModal protocolId={id} onAdded={fetchSpecimens} />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {!specimens || specimens.length === 0 ? (
          <div className="col-span-full rounded-[32px] border-2 border-dashed border-slate-200 bg-white py-24 text-center font-black tracking-widest text-slate-300 uppercase italic">
            Chưa có mẫu phẩm nào được ghi nhận
          </div>
        ) : (
          specimens.map((item) => (
            <Card
              key={item.id}
              className="group relative overflow-hidden rounded-[32px] border-none bg-white p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="rounded-2xl bg-slate-50 p-3 transition-colors group-hover:bg-slate-100">
                    {getSpecimenIcon(item.type)}
                  </div>
                  <div>
                    <h4 className="text-base leading-none font-black text-slate-800 uppercase">
                      {item.specimen_code}
                    </h4>
                    <p className="mt-1 text-[10px] font-bold text-slate-400 uppercase">
                      {item.type} • {item.fertilization_date || "Chưa rõ ngày"}
                    </p>
                  </div>
                </div>
                {getStatusBadge(item.status)}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-[8px] font-black text-slate-400 uppercase">
                    Phát triển
                  </p>
                  <p
                    className={`text-xs font-black uppercase ${item.development_day ? "text-slate-700" : "text-slate-300"}`}
                  >
                    {item.type === "embryo"
                      ? item.development_day
                        ? `Ngày ${item.development_day}`
                        : "N/A"
                      : "---"}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-[8px] font-black text-slate-400 uppercase">
                    Phân loại
                  </p>
                  <p
                    className={`text-xs font-black uppercase ${item.grade ? "text-blue-600" : "text-slate-300"}`}
                  >
                    {item.grade || (item.type === "egg" ? "Sơ cấp" : "Chưa rõ")}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-slate-50 pt-4">
                <div className="flex gap-2">
                  <AddSpecimenModal
                    protocolId={id}
                    onAdded={fetchSpecimens}
                    editData={item}
                  />
                  <DeleteConfirm
                    description={`mẫu phẩm ${item.specimen_code}`}
                    onConfirm={() => handleDeleteSpecimen(item.id)}
                  />
                </div>
                <span className="text-[9px] font-bold text-slate-300 italic">
                  Medicen Lab System
                </span>
              </div>
            </Card>
          ))
        )}
      </div>
    </>
  );
}

export default SpecimenTab;
