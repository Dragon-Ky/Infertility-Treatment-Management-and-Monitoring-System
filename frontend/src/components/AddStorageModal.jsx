import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createStorageRecord,
  updateStorageRecord,
} from "@/services/storageService";
import { useProtocolData } from "@/contexts/ProtocolContext";
import {
  HiOutlinePlus,
  HiOutlineLocationMarker,
  HiOutlinePencilAlt,
} from "react-icons/hi";
import toast from "react-hot-toast";

// BỔ SUNG: prop defaultItemId để nhận mẫu truyền sang từ SpecimenTab
const AddStorageModal = ({
  onAdded,
  editData = null,
  defaultItemId = null,
}) => {
  const { id: protocolId, specimens } = useProtocolData();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const isEdit = !!editData;

  const [formData, setFormData] = useState({
    treatment_id: protocolId,
    item_id: defaultItemId ? String(defaultItemId) : "",
    storage_type: "embryo",
    start_date: new Date().toISOString().split("T")[0],
    expiry_date: "",
    location_code: "",
    item_type: "App\\Models\\SpecimenRecord",
  });

  useEffect(() => {
    if (open && editData) {
      setFormData({
        ...editData,
        start_date: editData.start_date?.substring(0, 10),
        expiry_date: editData.expiry_date?.substring(0, 10),
      });
    } else if (open && !editData && defaultItemId) {
      setFormData((prev) => ({ ...prev, item_id: String(defaultItemId) }));
    }
  }, [open, editData, defaultItemId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const selectedSpecimen = specimens.find(
        (s) => s.id === parseInt(formData.item_id),
      );
      const data = {
        ...formData,
        treatment_id: parseInt(protocolId),
        item_id: parseInt(formData.item_id),
        // Chỉnh lại storage_type cho khớp enum backend: embryo, sperm, oocyte
        storage_type:
          selectedSpecimen?.type === "egg" ? "oocyte" : selectedSpecimen?.type,
      };

      if (isEdit) {
        await updateStorageRecord(editData.id, data);
        toast.success("Cập nhật vị trí lưu trữ thành công");
      } else {
        await createStorageRecord(data);
        toast.success("Đã gán vị trí lưu trữ cho mẫu");
      }
      setOpen(false);
      onAdded();
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi lưu kho");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEdit ? (
          <button className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-amber-50 text-amber-600 shadow-sm transition-colors hover:bg-amber-600 hover:text-white">
            <HiOutlinePencilAlt size={16} />
          </button>
        ) : (
          <Button className="h-12 cursor-pointer rounded-2xl bg-blue-600 px-6 text-[10px] font-black tracking-widest text-white shadow-lg shadow-blue-100">
            <HiOutlinePlus className="mr-2" size={18} /> Vị trí lưu kho
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="z-[9999] rounded-[32px] border-none p-8 shadow-2xl sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-black tracking-tighter text-slate-800 uppercase">
            <HiOutlineLocationMarker
              className={isEdit ? "text-amber-600" : "text-blue-600"}
            />
            {isEdit ? "Cập nhật lưu trữ" : "Thiết lập lưu trữ"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <label className="ml-1 text-[10px] font-black text-slate-400 uppercase">
              Chọn mẫu phẩm
            </label>
            <Select
              value={String(formData.item_id)}
              onValueChange={(val) =>
                setFormData({ ...formData, item_id: val })
              }
            >
              <SelectTrigger className="h-12 rounded-xl border-none bg-slate-50 font-bold">
                <SelectValue placeholder="Chọn mẫu từ Lab..." />
              </SelectTrigger>
              <SelectContent className="z-[10001] rounded-xl border-none shadow-2xl">
                {specimens?.map((s) => (
                  <SelectItem
                    key={s.id}
                    value={String(s.id)}
                    className="cursor-pointer rounded-xl font-bold transition-colors focus:bg-blue-600 focus:text-white"
                  >
                    [{s.specimen_code}] - {s.type.toUpperCase()} - {s.status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="ml-1 text-[10px] font-black text-slate-400 uppercase">
              Mã vị trí (Tank/Rack/Slot)
            </label>
            <Input
              placeholder="VD: TANK-01-R02-S05"
              value={formData.location_code}
              onChange={(e) =>
                setFormData({ ...formData, location_code: e.target.value })
              }
              required
              className="h-12 rounded-xl border-none bg-slate-50 font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="ml-1 text-[10px] font-black text-slate-400 uppercase">
                Ngày bắt đầu
              </label>
              <Input
                type="date"
                value={formData.start_date}
                onChange={(e) =>
                  setFormData({ ...formData, start_date: e.target.value })
                }
                className="h-12 rounded-xl border-none bg-slate-50 font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="ml-1 text-[10px] font-black text-slate-400 uppercase">
                Ngày hết hạn
              </label>
              <Input
                type="date"
                value={formData.expiry_date}
                onChange={(e) =>
                  setFormData({ ...formData, expiry_date: e.target.value })
                }
                className="h-12 rounded-xl border-none bg-slate-50 font-bold text-red-500"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className={`h-14 w-full cursor-pointer rounded-2xl font-black text-white uppercase shadow-xl transition-colors ${
              isEdit
                ? "bg-amber-500 hover:bg-amber-600"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading
              ? "ĐANG XỬ LÝ..."
              : isEdit
                ? "CẬP NHẬT LƯU KHO"
                : "XÁC NHẬN LƯU KHO"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStorageModal;
