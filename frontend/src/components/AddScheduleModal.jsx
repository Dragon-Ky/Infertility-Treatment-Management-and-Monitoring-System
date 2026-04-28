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
import { Input } from "@/components/ui/input";
import {
  createMedicationSchedule,
  updateMedicationSchedule,
} from "@/services/scheduleService";
import { HiOutlinePlus, HiOutlinePencilAlt } from "react-icons/hi";
import { FaCapsules } from "react-icons/fa6";
import toast from "react-hot-toast";
import { Button } from "./ui/button";

const AddScheduleModal = ({ protocolId, onAdded, editData = null }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const isEdit = !!editData;

  const [formData, setFormData] = useState({
    medication_name: "",
    dosage: "",
    route: "oral",
    start_date: "",
    end_date: "",
    frequency: "",
    time_slots: "",
  });

  // Đổ dữ liệu khi ở chế độ Edit
  useEffect(() => {
    if (open && editData) {
      setFormData({
        medication_name: editData.medication_name || "",
        dosage: editData.dosage || "",
        route: editData.route || "oral",
        start_date: editData.start_date || "",
        end_date: editData.end_date || "",
        frequency: editData.frequency || "",
        time_slots: editData.time_slots ? editData.time_slots.join(", ") : "",
      });
    } else if (open && !isEdit) {
      setFormData({
        medication_name: "",
        dosage: "",
        route: "oral",
        start_date: "",
        end_date: "",
        frequency: "",
        time_slots: "",
      });
    }
  }, [open, editData, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const slots = formData.time_slots
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s !== "");

    const data = {
      treatment_id: parseInt(protocolId),
      medication_name: formData.medication_name,
      dosage: formData.dosage,
      frequency: formData.frequency,
      start_date: formData.start_date,
      end_date: formData.end_date,
      time_slots: slots,
      route: formData.route,
    };

    setLoading(true);
    try {
      if (isEdit) {
        await updateMedicationSchedule(editData.id, data);
        toast.success("Đã cập nhật lịch thuốc!");
      } else {
        await createMedicationSchedule(data);
        toast.success("Đã lên lịch dùng thuốc thành công!");
      }
      setOpen(false);
      onAdded();
    } catch (error) {
      const backendError = error.response?.data?.errors;
      if (backendError) {
        const firstError = Object.values(backendError)[0][0];
        toast.error(`Lỗi: ${firstError}`);
      } else {
        toast.error("Thao tác thất bại! Kiểm tra lại dữ liệu.");
      }
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
          <Button className="h-12 cursor-pointer rounded-2xl bg-blue-600 px-6 text-[10px] font-black tracking-widest text-white shadow-lg shadow-blue-100 transition-all hover:bg-blue-700 active:scale-95">
            <HiOutlinePlus className="mr-2" size={18} /> Lên lịch thuốc
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="z-[9999] rounded-[32px] border-none p-8 sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle
            className={`flex items-center gap-2 text-2xl font-black tracking-tighter text-slate-800 uppercase`}
          >
            <FaCapsules
              className={isEdit ? "text-amber-600" : "text-blue-600"}
            />
            {isEdit ? "Điều chỉnh lịch thuốc" : "Thiết lập lịch thuốc"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <label className="ml-1 text-[10px] font-black text-slate-400 uppercase">
              Tên thuốc
            </label>
            <Input
              value={formData.medication_name}
              onChange={(e) =>
                setFormData({ ...formData, medication_name: e.target.value })
              }
              placeholder="Gonal-F, Progynova..."
              required
              className="h-12 rounded-xl border-none bg-slate-50 font-bold focus-visible:ring-2 focus-visible:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="ml-1 text-[10px] font-black text-slate-400 uppercase">
                Liều lượng
              </label>
              <Input
                value={formData.dosage}
                onChange={(e) =>
                  setFormData({ ...formData, dosage: e.target.value })
                }
                placeholder="225 UI, 2mg..."
                required
                className="h-12 rounded-xl border-none bg-slate-50 font-bold focus-visible:ring-2 focus-visible:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="ml-1 text-[10px] font-black text-slate-400 uppercase">
                Đường dùng (Route)
              </label>
              <Select
                value={formData.route}
                onValueChange={(val) =>
                  setFormData({ ...formData, route: val })
                }
              >
                <SelectTrigger className="h-12 w-full rounded-xl border-none bg-slate-50 px-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500">
                  <SelectValue placeholder="Chọn đường dùng..." />
                </SelectTrigger>
                <SelectContent className="z-[10001] rounded-xl border-none bg-white p-2 shadow-2xl">
                  <SelectItem
                    value="oral"
                    className="cursor-pointer rounded-lg font-bold focus:bg-blue-600 focus:text-white"
                  >
                    Đường uống (Oral)
                  </SelectItem>
                  <SelectItem
                    value="injection"
                    className="cursor-pointer rounded-lg font-bold focus:bg-blue-600 focus:text-white"
                  >
                    Đường tiêm (Injection)
                  </SelectItem>
                  <SelectItem
                    value="vaginal"
                    className="cursor-pointer rounded-lg font-bold focus:bg-blue-600 focus:text-white"
                  >
                    Đặt âm đạo (Vaginal)
                  </SelectItem>
                  <SelectItem
                    value="other"
                    className="cursor-pointer rounded-lg font-bold focus:bg-blue-600 focus:text-white"
                  >
                    Khác (Other)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
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
                required
                className="h-12 rounded-xl border-none bg-slate-50 font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="ml-1 text-[10px] font-black text-slate-400 uppercase">
                Ngày kết thúc
              </label>
              <Input
                type="date"
                value={formData.end_date}
                onChange={(e) =>
                  setFormData({ ...formData, end_date: e.target.value })
                }
                required
                className="h-12 rounded-xl border-none bg-slate-50 font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="ml-1 text-[10px] font-black text-slate-400 uppercase">
                Tần suất
              </label>
              <Input
                value={formData.frequency}
                onChange={(e) =>
                  setFormData({ ...formData, frequency: e.target.value })
                }
                placeholder="3 lần/ngày..."
                required
                className="h-12 rounded-xl border-none bg-slate-50 font-bold focus-visible:ring-2 focus-visible:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="ml-1 text-[10px] font-black text-slate-400 uppercase">
                Khung giờ (Dấu phẩy)
              </label>
              <Input
                value={formData.time_slots}
                onChange={(e) =>
                  setFormData({ ...formData, time_slots: e.target.value })
                }
                placeholder="08:00, 20:00"
                required
                className="h-12 rounded-xl border-none bg-slate-50 font-bold focus-visible:ring-2 focus-visible:ring-blue-500"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className={`mt-4 h-14 w-full cursor-pointer rounded-2xl font-black tracking-widest text-white uppercase shadow-xl transition-all active:scale-95 ${
              isEdit
                ? "bg-amber-500 hover:bg-amber-600"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading
              ? "ĐANG XỬ LÝ..."
              : isEdit
                ? "CẬP NHẬT KẾ HOẠCH"
                : "HOÀN TẤT THIẾT LẬP"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddScheduleModal;
