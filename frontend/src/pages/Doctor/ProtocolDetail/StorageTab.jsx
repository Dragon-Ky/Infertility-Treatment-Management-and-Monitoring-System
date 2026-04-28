import { useProtocolData } from "@/contexts/ProtocolContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HiOutlineDatabase } from "react-icons/hi";
import { deleteStorageRecord } from "@/services/storageService";
import DeleteConfirm from "@/components/DeleteConfirm";
import AddStorageModal from "@/components/AddStorageModal";
import toast from "react-hot-toast";

function StorageTab() {
  const { specimens, fetchFullData } = useProtocolData();

  const storedItems =
    specimens?.filter((s) => s.storage !== null && s.storage !== undefined) ||
    [];

  const handleDelete = async (storageId) => {
    try {
      await deleteStorageRecord(storageId);
      toast.success("Đã giải phóng vị trí kho");
      fetchFullData();
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error("Lỗi khi xóa");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-black tracking-tighter text-slate-800 uppercase">
          Tổng quan kho lạnh (Storage)
        </h3>
        <AddStorageModal onAdded={fetchFullData} />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {storedItems.length === 0 ? (
          <div className="col-span-full rounded-[32px] border-2 border-dashed border-slate-200 bg-white py-24 text-center font-black tracking-widest text-slate-300 uppercase italic">
            CHƯA CÓ MẪU NÀO ĐƯỢC LƯU KHO
          </div>
        ) : (
          storedItems.map((item) => (
            <Card
              key={item.id}
              className="group relative overflow-hidden rounded-[32px] border-none bg-white p-7 shadow-sm transition-all hover:shadow-md"
            >
              <div className="mb-5 flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="rounded-2xl bg-slate-900 p-4 text-white transition-colors">
                    <HiOutlineDatabase size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg leading-none font-black text-slate-800 uppercase">
                      {item.storage.location_code}
                    </h4>
                    <Badge
                      variant="outline"
                      className="mt-2 border-slate-200 text-[9px] font-black text-slate-400 uppercase"
                    >
                      {item.type.toUpperCase()} #{item.specimen_code}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-3 rounded-2xl bg-slate-50 p-4">
                <div className="flex justify-between">
                  <span className="text-[9px] font-black text-slate-400 uppercase">
                    Ngày lưu
                  </span>
                  <span className="text-[10px] font-black text-slate-800">
                    {item.storage.start_date?.substring(0, 10)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[9px] font-black text-slate-400 uppercase">
                    Hết hạn
                  </span>
                  <span className="text-[10px] font-black text-red-500 uppercase italic">
                    {item.storage.expiry_date
                      ? item.storage.expiry_date.substring(0, 10)
                      : "KHÔNG XÁC ĐỊNH"}
                  </span>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-slate-50 pt-4">
                <div className="flex gap-2">
                  <AddStorageModal
                    editData={item.storage}
                    onAdded={fetchFullData}
                  />
                  <DeleteConfirm
                    description="vị trí lưu kho"
                    onConfirm={() => handleDelete(item.storage.id)}
                  />
                </div>

                <span className="text-[9px] font-bold text-slate-300 italic">
                  Medicen Storage System
                </span>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

export default StorageTab;
