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
import { Textarea } from "@/components/ui/textarea";
import { createSpecimen, updateSpecimen } from "@/services/specimenService";
import {
  HiOutlinePlus,
  HiOutlineDatabase,
  HiOutlinePencilAlt,
} from "react-icons/hi";
import toast from "react-hot-toast";

const AddSpecimenModal = ({ protocolId, onAdded, editData = null }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const isEdit = !!editData;

  const [formData, setFormData] = useState({
    treatment_id: protocolId,
    type: "egg", // Khớp in:embryo,egg,sperm
    specimen_code: "",
    fertilization_date: "",
    development_day: "", // in:3,5,6
    grade: "",
    status: "fresh", // in:fresh,frozen,used,discarded
    notes: "",
  });

  useEffect(() => {
    if (open && editData) {
      setFormData({
        treatment_id: protocolId,
        type: editData.type || "egg",
        specimen_code: editData.specimen_code || "",
        fertilization_date: editData.fertilization_date
          ? editData.fertilization_date.substring(0, 10)
          : "",
        development_day: editData.development_day
          ? String(editData.development_day)
          : "",
        grade: editData.grade || "",
        status: editData.status || "fresh",
        notes: editData.notes || "",
      });
    } else if (open && !isEdit) {
      setFormData({
        treatment_id: protocolId,
        type: "egg",
        specimen_code: "SPEC-" + Date.now(),
        fertilization_date: "",
        development_day: "",
        grade: "",
        status: "fresh",
        notes: "",
      });
    }
  }, [open, editData, isEdit, protocolId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const devDay =
        formData.type === "embryo" && formData.development_day
          ? String(formData.development_day)
          : null;

      const dataToSend = {
        treatment_id: Number(protocolId),
        type: String(formData.type),
        specimen_code: String(formData.specimen_code),
        fertilization_date: formData.fertilization_date || null,
        development_day: devDay,
        grade: formData.grade ? String(formData.grade) : null,
        status: String(formData.status),
        notes: formData.notes ? String(formData.notes) : null,
      };

      if (isEdit) {
        console.log("Cập nhật Specimen ID:", editData.id, dataToSend);
        await updateSpecimen(editData.id, dataToSend);
        toast.success("Cập nhật mẫu phẩm thành công!");
      } else {
        await createSpecimen(dataToSend);
        toast.success("Đã khởi tạo mẫu phẩm!");
      }
      setOpen(false);
      onAdded();
    } catch (error) {
      console.error("Lỗi gửi Data:", error.response?.data);
      const msg =
        error.response?.data?.message || "Lỗi định dạng dữ liệu Enum!";
      toast.error(msg);
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
            <HiOutlinePlus className="mr-2" size={18} /> Thu hoạch mẫu
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="z-[9999] rounded-[32px] border-none p-8 shadow-2xl sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-black tracking-tighter text-slate-800 uppercase">
            <HiOutlineDatabase
              className={isEdit ? "text-amber-600" : "text-blue-600"}
            />
            {isEdit ? "Cập nhật bản ghi mẫu" : "Khởi tạo bản ghi mẫu phẩm"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="ml-1 text-[10px] font-black text-slate-400 uppercase">
                Mã mẫu phẩm (S-Code)
              </label>
              <Input
                value={formData.specimen_code}
                onChange={(e) =>
                  setFormData({ ...formData, specimen_code: e.target.value })
                }
                required
                className="h-12 rounded-xl border-none bg-slate-50 font-bold focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="ml-1 text-[10px] font-black text-slate-400 uppercase">
                Loại mẫu
              </label>
              <Select
                value={formData.type}
                onValueChange={(val) => setFormData({ ...formData, type: val })}
              >
                <SelectTrigger className="h-12 cursor-pointer rounded-xl border-none bg-slate-50 font-bold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-[10001] rounded-xl border-none bg-white p-1 shadow-2xl">
                  <SelectItem
                    value="egg"
                    className="cursor-pointer rounded-xl font-bold transition-colors focus:bg-blue-600 focus:text-white"
                  >
                    Trứng (Egg)
                  </SelectItem>
                  <SelectItem
                    value="sperm"
                    className="cursor-pointer rounded-xl font-bold transition-colors focus:bg-blue-600 focus:text-white"
                  >
                    Tinh trùng (Sperm)
                  </SelectItem>
                  <SelectItem
                    value="embryo"
                    className="cursor-pointer rounded-xl font-bold transition-colors focus:bg-blue-600 focus:text-white"
                  >
                    Phôi (Embryo)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="ml-1 text-[10px] font-black text-slate-400 uppercase">
                Ngày thụ tinh (nếu có)
              </label>
              <Input
                type="date"
                value={formData.fertilization_date}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fertilization_date: e.target.value,
                  })
                }
                className="h-12 rounded-xl border-none bg-slate-50 font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="ml-1 text-[10px] font-black text-slate-400 uppercase">
                Trạng thái lưu trữ
              </label>
              <Select
                value={formData.status}
                onValueChange={(val) =>
                  setFormData({ ...formData, status: val })
                }
              >
                <SelectTrigger className="h-12 cursor-pointer rounded-xl border-none bg-slate-50 font-bold uppercase">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-[10001] rounded-xl border-none bg-white p-1 shadow-2xl">
                  <SelectItem
                    value="fresh"
                    className="cursor-pointer rounded-xl font-black text-green-600 focus:bg-green-600 focus:text-white"
                  >
                    Tươi (Fresh)
                  </SelectItem>
                  <SelectItem
                    value="frozen"
                    className="cursor-pointer rounded-xl font-black text-blue-600 focus:bg-blue-600 focus:text-white"
                  >
                    Trữ Đông (Frozen)
                  </SelectItem>
                  <SelectItem
                    value="used"
                    className="cursor-pointer rounded-xl font-black text-slate-400 focus:bg-slate-400 focus:text-white"
                  >
                    Đã Dùng (Used)
                  </SelectItem>
                  <SelectItem
                    value="discarded"
                    className="cursor-pointer rounded-xl font-black text-red-600 focus:bg-red-600 focus:text-white"
                  >
                    Hủy (Discarded)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {formData.type === "embryo" && (
            <div className="animate-in fade-in slide-in-from-top-2 grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="ml-1 text-[10px] font-black text-slate-400 uppercase">
                  Ngày phát triển
                </label>
                <Select
                  value={formData.development_day}
                  onValueChange={(val) =>
                    setFormData({ ...formData, development_day: val })
                  }
                >
                  <SelectTrigger className="h-12 rounded-xl border-none bg-slate-50 px-4 font-bold">
                    <SelectValue placeholder="Chọn..." />
                  </SelectTrigger>
                  <SelectContent className="z-[10001] rounded-xl border-none bg-white p-1 shadow-2xl">
                    <SelectItem
                      value="3"
                      className="rounded-xl font-bold focus:bg-blue-600 focus:text-white"
                    >
                      Ngày 3
                    </SelectItem>
                    <SelectItem
                      value="5"
                      className="rounded-xl font-bold focus:bg-blue-600 focus:text-white"
                    >
                      Ngày 5
                    </SelectItem>
                    <SelectItem
                      value="6"
                      className="rounded-xl font-bold focus:bg-blue-600 focus:text-white"
                    >
                      Ngày 6
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="ml-1 text-[10px] font-black text-slate-400 uppercase">
                  Phân loại (Grade)
                </label>
                <Input
                  placeholder="VD: 4AA, 3BB..."
                  value={formData.grade}
                  onChange={(e) =>
                    setFormData({ ...formData, grade: e.target.value })
                  }
                  className="h-12 rounded-xl border-none bg-slate-50 px-4 font-black text-blue-600"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="ml-1 text-[10px] font-black text-slate-400 uppercase">
              Ghi chú
            </label>
            <Textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="min-h-[80px] rounded-xl border-none bg-slate-50 px-4 py-3 font-medium"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className={`h-14 w-full cursor-pointer rounded-2xl font-black text-white uppercase shadow-xl ${isEdit ? "bg-amber-500 hover:bg-amber-600" : "bg-blue-700 hover:bg-blue-800"}`}
          >
            {loading ? "ĐANG XỬ LÝ..." : isEdit ? "CẬP NHẬT" : "XÁC NHẬN"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSpecimenModal;
