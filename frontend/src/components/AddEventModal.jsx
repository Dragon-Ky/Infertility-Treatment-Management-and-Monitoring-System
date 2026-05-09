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
import { createEvent, updateEvent } from "@/services/eventService";
import {
  HiOutlinePlus,
  HiOutlineCalendar,
  HiOutlinePencilAlt,
} from "react-icons/hi";
import toast from "react-hot-toast";

const AddEventModal = ({ protocolId, onEventAdded, editData = null }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const isEdit = !!editData;

  const [formData, setFormData] = useState({
    event_type: "consultation",
    event_date: "",
    description: "",
  });

  useEffect(() => {
    if (open && editData) {
      const dateForInput = editData.event_date
        ? editData.event_date.replace(" ", "T").substring(0, 16)
        : "";

      setFormData({
        event_type: editData.event_type,
        event_date: dateForInput,
        description: editData.description,
      });
    } else if (open && !isEdit) {
      setFormData({
        event_type: "consultation",
        event_date: "",
        description: "",
      });
    }
  }, [open, editData, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedDate = formData.event_date.replace("T", " ");

    const data = {
      treatment_id: parseInt(protocolId),
      event_type: formData.event_type,
      event_date: formattedDate,
      description: formData.description,
      result: editData?.result || "",
      doctor_notes: editData?.doctor_notes || "",
    };

    setLoading(true);
    try {
      if (isEdit) {
        await updateEvent(editData.id, data);
        toast.success("Đã cập nhật sự kiện!");
      } else {
        await createEvent(data);
        toast.success("Đã ghi nhận sự kiện thành công!");
      }

      setOpen(false);
      onEventAdded();
    } catch (error) {
      const msg = error.response?.data?.message || "Thao tác thất bại!";
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
          <Button className="cursor-pointer gap-2 rounded-2xl bg-blue-600 px-8 font-black shadow-lg shadow-blue-100 transition-all hover:bg-blue-700 active:scale-95">
            <HiOutlinePlus size={20} /> Thêm sự kiện mới
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="z-[9999] rounded-[32px] border-none p-8 shadow-2xl sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle
            className={`flex items-center gap-2 text-2xl font-black tracking-tighter text-slate-800 uppercase`}
          >
            <HiOutlineCalendar
              className={isEdit ? "text-amber-600" : "text-blue-600"}
            />
            {isEdit ? "Chỉnh sửa sự kiện" : "Ghi nhận sự kiện"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Loại sự kiện
            </label>
            <Select
              value={formData.event_type}
              onValueChange={(val) =>
                setFormData({ ...formData, event_type: val })
              }
            >
              <SelectTrigger className="h-12 w-full rounded-xl border-none bg-slate-50 px-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500">
                <SelectValue placeholder="Chọn loại sự kiện..." />
              </SelectTrigger>
              <SelectContent className="z-[10001] rounded-xl border-none bg-white p-2 shadow-2xl">
                <SelectItem
                  value="ultrasound"
                  className="cursor-pointer rounded-lg font-bold focus:bg-blue-600 focus:text-white"
                >
                  Siêu âm
                </SelectItem>
                <SelectItem
                  value="blood_test"
                  className="cursor-pointer rounded-lg font-bold focus:bg-blue-600 focus:text-white"
                >
                  Xét nghiệm máu
                </SelectItem>
                <SelectItem
                  value="egg_retrieval"
                  className="cursor-pointer rounded-lg font-bold focus:bg-blue-600 focus:text-white"
                >
                  Chọc hút trứng
                </SelectItem>
                <SelectItem
                  value="embryo_transfer"
                  className="cursor-pointer rounded-lg font-bold focus:bg-blue-600 focus:text-white"
                >
                  Chuyển phôi
                </SelectItem>
                <SelectItem
                  value="insemination"
                  className="cursor-pointer rounded-lg font-bold focus:bg-blue-600 focus:text-white"
                >
                  Thụ tinh
                </SelectItem>
                <SelectItem
                  value="consultation"
                  className="cursor-pointer rounded-lg font-bold focus:bg-blue-600 focus:text-white"
                >
                  Thăm khám/Tư vấn
                </SelectItem>
                <SelectItem
                  value="other"
                  className="cursor-pointer rounded-lg font-bold focus:bg-blue-600 focus:text-white"
                >
                  Khác
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="ml-1 cursor-pointer text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Thời gian diễn ra
            </label>
            <Input
              type="datetime-local"
              value={formData.event_date}
              onChange={(e) =>
                setFormData({ ...formData, event_date: e.target.value })
              }
              required
              className="h-12 rounded-xl border-none bg-slate-50 font-bold text-slate-600"
            />
          </div>

          <div className="space-y-2">
            <label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Mô tả chi tiết
            </label>
            <Textarea
              placeholder="Ví dụ: Niêm mạc đẹp, nang trứng phát triển tốt..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              className="min-h-[100px] rounded-xl border-none bg-slate-50 p-4 text-sm font-medium"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className={`mt-2 h-14 w-full cursor-pointer rounded-2xl bg-slate-900 text-xs font-black tracking-widest text-white uppercase shadow-xl transition-all ${
              isEdit
                ? "bg-amber-500 hover:bg-amber-600"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading
              ? "ĐANG XỬ LÝ..."
              : isEdit
                ? "CẬP NHẬT THAY ĐỔI"
                : "XÁC NHẬN LƯU"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEventModal;
