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
import {
  createPregnancyTracking,
  updatePregnancyTracking,
} from "@/services/pregnancyService";
import { useProtocolData } from "@/contexts/ProtocolContext";
import { HiOutlinePlus, HiOutlinePencilAlt } from "react-icons/hi";
import { TbBabyCarriage } from "react-icons/tb";
import toast from "react-hot-toast";

const AddPregnancyModal = ({ onAdded, editData = null }) => {
  const { id: protocolId } = useProtocolData();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const isEdit = !!editData;

  const [formData, setFormData] = useState({
    treatment_id: protocolId,
    tracking_date: new Date().toISOString().split("T")[0],
    week_number: "",
    status: "ongoing",
    notes: "",
  });

  useEffect(() => {
    if (open && editData) {
      setFormData({
        ...editData,
        tracking_date: editData.tracking_date?.substring(0, 10),
        week_number: editData.week_number,
      });
    } else if (open && !isEdit) {
      setFormData({
        treatment_id: protocolId,
        tracking_date: new Date().toISOString().split("T")[0],
        week_number: "",
        status: "ongoing",
        notes: "",
      });
    }
  }, [open, editData, isEdit, protocolId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dataToSend = {
        ...formData,
        treatment_id: parseInt(protocolId),
        week_number: parseInt(formData.week_number),
      };

      if (isEdit) {
        await updatePregnancyTracking(editData.id, dataToSend);
        toast.success("Cập nhật mốc khám thai thành công");
      } else {
        await createPregnancyTracking(dataToSend);
        toast.success("Đã thêm mốc theo dõi thai kỳ");
      }
      setOpen(false);
      onAdded();
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi cập nhật thai kỳ");
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
          <Button className="h-12 cursor-pointer rounded-2xl bg-pink-500 px-6 text-[10px] font-black tracking-widest text-white shadow-lg shadow-pink-100 hover:bg-pink-600">
            <HiOutlinePlus className="mr-2" size={18} /> Ghi nhận mốc mới
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="z-[9999] rounded-[32px] border-none p-8 shadow-2xl sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-black tracking-tighter text-slate-800 uppercase">
            <TbBabyCarriage
              className={isEdit ? "text-amber-500" : "text-pink-500"}
              size={28}
            />
            {isEdit ? "Cập nhật mốc khám thai" : "Theo dõi thai kỳ"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="ml-1 text-[10px] font-black text-slate-400 uppercase">
                Ngày khám
              </label>
              <Input
                type="date"
                value={formData.tracking_date}
                onChange={(e) =>
                  setFormData({ ...formData, tracking_date: e.target.value })
                }
                required
                className="h-12 rounded-xl border-none bg-slate-50 font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="ml-1 text-[10px] font-black text-slate-400 uppercase">
                Tuần thai (Week)
              </label>
              <Input
                type="number"
                min="0"
                max="42"
                placeholder="VD: Tuần thứ 5"
                value={formData.week_number}
                onChange={(e) =>
                  setFormData({ ...formData, week_number: e.target.value })
                }
                required
                className="h-12 rounded-xl border-none bg-slate-50 font-black text-pink-600"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="ml-1 text-[10px] font-black text-slate-400 uppercase">
              Tình trạng thai kỳ
            </label>
            <Select
              value={formData.status}
              onValueChange={(val) => setFormData({ ...formData, status: val })}
            >
              <SelectTrigger className="h-12 rounded-xl border-none bg-slate-50 font-bold uppercase">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-[10001] rounded-xl border-none shadow-2xl">
                <SelectItem
                  value="ongoing"
                  className="cursor-pointer rounded-xl font-bold text-blue-600 focus:bg-blue-600 focus:text-white"
                >
                  Đang phát triển (Ongoing)
                </SelectItem>
                <SelectItem
                  value="delivered"
                  className="cursor-pointer rounded-xl font-bold text-green-600 focus:bg-green-600 focus:text-white"
                >
                  Đã sinh thành công (Delivered)
                </SelectItem>
                <SelectItem
                  value="miscarried"
                  className="cursor-pointer rounded-xl font-bold text-red-600 focus:bg-red-600 focus:text-white"
                >
                  Đình chỉ / Sảy thai (Miscarried)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="ml-1 text-[10px] font-black text-slate-400 uppercase">
              Chỉ số & Ghi chú (Beta hCG, Tim thai...)
            </label>
            <Textarea
              placeholder="Nhập kết quả siêu âm, chỉ số..."
              value={formData.notes || ""}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="min-h-[100px] rounded-xl border-none bg-slate-50 p-4 font-medium"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className={`h-14 w-full cursor-pointer rounded-2xl font-black text-white uppercase shadow-xl transition-colors ${
              isEdit
                ? "bg-amber-500 hover:bg-amber-600"
                : "bg-pink-500 hover:bg-pink-600"
            }`}
          >
            {loading
              ? "ĐANG XỬ LÝ..."
              : isEdit
                ? "CẬP NHẬT THÔNG TIN"
                : "LƯU MỐC KHÁM"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPregnancyModal;
