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
import { HiOutlinePlus } from "react-icons/hi";
import toast from "react-hot-toast";

const AddEventModal = ({ protocolId, onEventAdded }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      protocol_id: protocolId,
      event_type: formData.get("event_type"),
      description: formData.get("description"),
      event_date: formData.get("event_date"),
    };

    setLoading(true);
    try {
      await createEvent(data);
      toast.success("Đã thêm sự kiện mới!");
      setOpen(false);
      onEventAdded(); // Gọi lại hàm load data
    } catch (error) {
      toast.error("Không thể thêm sự kiện!");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 rounded-xl bg-blue-600 px-8 font-black shadow-lg shadow-blue-100 hover:bg-blue-700">
          <HiOutlinePlus size={20} /> THÊM SỰ KIỆN MỚI
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-[32px] border-none shadow-2xl sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black tracking-tighter text-slate-800 uppercase">
            Ghi nhận sự kiện
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <label className="text-xs font-black tracking-widest text-slate-400 uppercase">
              Loại sự kiện
            </label>
            <Input
              name="event_type"
              placeholder="Ví dụ: Tiêm thuốc, Siêu âm..."
              required
              className="h-12 rounded-xl border-none bg-slate-50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black tracking-widest text-slate-400 uppercase">
              Thời gian
            </label>
            <Input
              name="event_date"
              type="datetime-local"
              required
              className="h-12 rounded-xl border-none bg-slate-50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black tracking-widest text-slate-400 uppercase">
              Ghi chú chi tiết
            </label>
            <Textarea
              name="description"
              placeholder="Nhập nội dung sự kiện..."
              required
              className="min-h-[100px] rounded-xl border-none bg-slate-50"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="h-14 w-full rounded-2xl bg-slate-900 text-lg font-black hover:bg-slate-800"
          >
            {loading ? "ĐANG LƯU..." : "LƯU SỰ KIỆN"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEventModal;
