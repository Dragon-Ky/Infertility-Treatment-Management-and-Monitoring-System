import { useState } from "react";
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
import { createMedicationRecord } from "@/services/recordService";
import { HiOutlineCheckCircle } from "react-icons/hi";
import { FaSyringe } from "react-icons/fa6";
import toast from "react-hot-toast";

const AddRecordModal = ({ schedule, onAdded }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Lấy thời gian hiện tại làm mặc định
  const now = new Date();
  // Format thành YYYY-MM-DDTHH:mm cho input datetime-local
  const nowString = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);

  const [formData, setFormData] = useState({
    scheduled_time: nowString,
    actual_time: nowString,
    status: "taken",
    notes: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dataToSend = {
        ...formData,
        medication_schedule_id: schedule.id,
        recorded_by: 1,
      };

      await createMedicationRecord(dataToSend);
      toast.success("Đã ghi nhận sử dụng thuốc!");
      setOpen(false);
      onAdded();
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi ghi nhận!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-10 w-full cursor-pointer rounded-xl bg-blue-600 px-4 text-[10px] font-black tracking-widest text-white shadow-md transition-all hover:bg-blue-700 active:scale-95">
          <HiOutlineCheckCircle className="mr-2" size={16} /> TICK THUỐC
        </Button>
      </DialogTrigger>

      <DialogContent className="z-[9999] rounded-[32px] border-none p-8 shadow-2xl sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-black tracking-tighter text-slate-800 uppercase">
            <FaSyringe className="text-blue-600" />
            Ghi nhận dùng thuốc
          </DialogTitle>
          <p className="text-sm font-bold text-slate-500">
            Thuốc:{" "}
            <span className="text-blue-600 uppercase">
              {schedule.medication_name}
            </span>
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="ml-1 text-[10px] font-black text-slate-400 uppercase">
                Giờ dự kiến
              </label>
              <Input
                type="datetime-local"
                value={formData.scheduled_time}
                onChange={(e) =>
                  setFormData({ ...formData, scheduled_time: e.target.value })
                }
                required
                className="h-12 rounded-xl border-none bg-slate-50 font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="ml-1 text-[10px] font-black text-slate-400 uppercase">
                Giờ thực tế
              </label>
              <Input
                type="datetime-local"
                value={formData.actual_time}
                onChange={(e) =>
                  setFormData({ ...formData, actual_time: e.target.value })
                }
                required
                className="h-12 rounded-xl border-none bg-slate-50 font-bold text-blue-600"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="ml-1 text-[10px] font-black text-slate-400 uppercase">
              Trạng thái
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
                  value="taken"
                  className="rounded-xl font-bold text-green-600 focus:bg-green-600 focus:text-white"
                >
                  Đã Dùng (Taken)
                </SelectItem>
                <SelectItem
                  value="missed"
                  className="rounded-xl font-bold text-red-600 focus:bg-red-600 focus:text-white"
                >
                  Bỏ Lỡ (Missed)
                </SelectItem>
                <SelectItem
                  value="skipped"
                  className="rounded-xl font-bold text-slate-500 focus:bg-slate-500 focus:text-white"
                >
                  Bỏ Qua (Skipped)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="ml-1 text-[10px] font-black text-slate-400 uppercase">
              Ghi chú thêm
            </label>
            <Textarea
              placeholder="Bệnh nhân có phản ứng phụ gì không?..."
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
            className="mt-4 h-14 w-full cursor-pointer rounded-2xl bg-blue-600 font-black text-white uppercase shadow-xl hover:bg-blue-700"
          >
            {loading ? "ĐANG XỬ LÝ..." : "XÁC NHẬN"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddRecordModal;
