import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createEvent } from "@/services/eventService";
import { HiOutlinePlus, HiOutlineCalendar } from "react-icons/hi";
import toast from "react-hot-toast";

const AddEventModal = ({ protocolId, onEventAdded }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const rawDate = formData.get("event_date");
    const formattedDate = rawDate.replace("T", " ");

    const data = {
      treatment_id: parseInt(protocolId),
      event_type: formData.get("event_type"),
      event_date: formattedDate,
      description: formData.get("description"),
      result: "",
      doctor_notes: "",
    };

    setLoading(true);
    try {
      await createEvent(data);
      toast.success("Đã ghi nhận sự kiện thành công!");
      setOpen(false);
      onEventAdded();
    } catch (error) {
      const msg = error.response?.data?.message || "Không thể thêm sự kiện!";
      toast.error(msg);
      console.log("Dữ liệu gửi lỗi:", data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 rounded-2xl bg-blue-600 px-8 font-black shadow-lg shadow-blue-100 transition-all hover:bg-blue-700 active:scale-95">
          <HiOutlinePlus size={20} /> THÊM SỰ KIỆN MỚI
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-[32px] border-none p-8 shadow-2xl sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-black tracking-tighter text-slate-800 uppercase">
            <HiOutlineCalendar className="text-blue-600" /> Ghi nhận sự kiện
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Loại sự kiện (Bắt buộc theo hệ thống)
            </label>
            <select
              name="event_type"
              required
              className="h-12 w-full rounded-xl border-none bg-slate-50 px-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ultrasound">Siêu âm (Ultrasound)</option>
              <option value="blood_test">Xét nghiệm máu (Blood Test)</option>
              <option value="egg_retrieval">
                Chọc hút trứng (Egg Retrieval)
              </option>
              <option value="embryo_transfer">
                Chuyển phôi (Embryo Transfer)
              </option>
              <option value="insemination">Thụ tinh (Insemination)</option>
              <option value="consultation">Thăm khám/Tư vấn</option>
              <option value="other">Khác (Other)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Thời gian diễn ra
            </label>
            <Input
              name="event_date"
              type="datetime-local"
              required
              className="h-12 rounded-xl border-none bg-slate-50 font-bold text-slate-600"
            />
          </div>

          <div className="space-y-2">
            <label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Mô tả chi tiết
            </label>
            <Textarea
              name="description"
              placeholder="Ví dụ: Niêm mạc đẹp, nang trứng phát triển tốt..."
              required
              className="min-h-[100px] rounded-xl border-none bg-slate-50 p-4 text-sm font-medium"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="mt-2 h-14 w-full rounded-2xl bg-slate-900 text-xs font-black tracking-widest text-white uppercase shadow-xl hover:bg-slate-800"
          >
            {loading ? "ĐANG XỬ LÝ..." : "XÁC NHẬN LƯU"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEventModal;
