import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createMedicationSchedule } from "@/services/scheduleService";
import { HiOutlinePlus } from "react-icons/hi";
import { FaCapsules } from "react-icons/fa6";
import toast from "react-hot-toast";

const AddScheduleModal = ({ protocolId, onAdded }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const slots = formData
      .get("time_slots")
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s !== "");

    const data = {
      treatment_id: parseInt(protocolId),
      medication_name: formData.get("medication_name"),
      dosage: formData.get("dosage"),
      frequency: formData.get("frequency"),
      start_date: formData.get("start_date"),
      end_date: formData.get("end_date"),
      time_slots: slots,
      route: formData.get("route"),
    };

    setLoading(true);
    try {
      await createMedicationSchedule(data);
      toast.success("Đã lên lịch dùng thuốc thành công!");
      setOpen(false);
      onAdded();
    } catch (error) {
      const backendError = error.response?.data?.errors;
      if (backendError) {
        const firstError = Object.values(backendError)[0][0];
        toast.error(`Lỗi: ${firstError}`);
      } else {
        toast.error("Lỗi khi tạo lịch! Kiểm tra lại ngày tháng.");
      }
      console.log("Dữ liệu gửi lỗi:", data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-12 rounded-2xl bg-slate-900 px-6 text-[10px] font-black tracking-widest text-white uppercase shadow-xl transition-all hover:bg-slate-800">
          <HiOutlinePlus className="mr-2" size={18} /> LÊN LỊCH THUỐC
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-[32px] border-none p-8 sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-black tracking-tighter text-slate-800 uppercase">
            <FaCapsules className="text-blue-600" /> Thiết lập lịch thuốc
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <label className="ml-1 text-[10px] font-black text-slate-400 uppercase">
              Tên thuốc
            </label>
            <Input
              name="medication_name"
              placeholder="Gonal-F, Progynova..."
              required
              className="h-12 rounded-xl border-none bg-slate-50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="ml-1 text-[10px] font-black text-slate-400 uppercase">
                Liều lượng
              </label>
              <Input
                name="dosage"
                placeholder="225 UI, 2mg..."
                required
                className="h-12 rounded-xl border-none bg-slate-50"
              />
            </div>
            <div className="space-y-2">
              <label className="ml-1 text-[10px] font-black text-slate-400 uppercase">
                Đường dùng (Route)
              </label>
              <select
                name="route"
                required
                className="h-12 w-full rounded-xl border-none bg-slate-50 px-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="oral">Đường uống (Oral)</option>
                <option value="injection">Đường tiêm (Injection)</option>
                <option value="vaginal">Đặt âm đạo (Vaginal)</option>
                <option value="other">Khác (Other)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="ml-1 text-[10px] font-black text-slate-400 uppercase">
                Ngày bắt đầu
              </label>
              <Input
                name="start_date"
                type="date"
                required
                className="h-12 rounded-xl border-none bg-slate-50"
              />
            </div>
            <div className="space-y-2">
              <label className="ml-1 text-[10px] font-black text-slate-400 uppercase">
                Ngày kết thúc
              </label>
              <Input
                name="end_date"
                type="date"
                required
                className="h-12 rounded-xl border-none bg-slate-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="ml-1 text-[10px] font-black text-slate-400 uppercase">
                Tần suất
              </label>
              <Input
                name="frequency"
                placeholder="3 lần/ngày..."
                required
                className="h-12 rounded-xl border-none bg-slate-50"
              />
            </div>
            <div className="space-y-2">
              <label className="ml-1 text-[10px] font-black text-slate-400 uppercase">
                Khung giờ (Dấu phẩy)
              </label>
              <Input
                name="time_slots"
                placeholder="08:00, 20:00"
                required
                className="h-12 rounded-xl border-none bg-slate-50"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="mt-4 h-14 w-full rounded-2xl bg-blue-600 font-black tracking-widest text-white uppercase shadow-xl transition-all hover:bg-blue-700"
          >
            {loading ? "ĐANG XỬ LÝ..." : "HOÀN TẤT THIẾT LẬP"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddScheduleModal;
