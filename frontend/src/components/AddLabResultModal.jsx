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
import { createLabResult } from "@/services/labService";
import { HiOutlinePlus, HiOutlineBeaker } from "react-icons/hi";
import toast from "react-hot-toast";

const AddLabResultModal = ({ protocol, onAdded }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  console.log(protocol);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const data = {
      treatment_id: protocol.id,
      test_type: formData.get("test_type"),
      test_date: formData.get("test_date"),
      result_data: [formData.get("result_value")],
      unit: formData.get("unit"),
      reference_range: formData.get("reference_range"),
      doctor_notes: formData.get("doctor_notes"),
    };

    setLoading(true);
    try {
      await createLabResult(data);
      toast.success("Đã lưu kết quả xét nghiệm!");
      setOpen(false);
      onAdded();
    } catch (error) {
      // Hiển thị lỗi chi tiết từ Backend
      const errorMsg =
        error.response?.data?.message ||
        "Lỗi: Không tìm thấy ID phác đồ tương ứng!";
      toast.error(errorMsg);
      console.error("Gửi lên thất bại:", data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-12 rounded-2xl bg-blue-600 px-6 text-[10px] font-black tracking-widest text-white uppercase shadow-lg shadow-blue-100">
          <HiOutlinePlus className="mr-2" size={18} /> NHẬP KẾT QUẢ
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-[32px] border-none p-8 sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-black tracking-tighter text-slate-800 uppercase">
            <HiOutlineBeaker className="text-blue-600" /> Ghi nhận xét nghiệm
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="ml-1 text-[10px] font-black text-slate-400 uppercase">
                Loại xét nghiệm
              </label>
              <select
                name="test_type"
                required
                className="h-12 w-full rounded-xl border-none bg-slate-50 px-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="blood">Máu (Blood)</option>
                <option value="hormone">Nội tiết (Hormone)</option>
                <option value="ultrasound">Siêu âm (Ultrasound)</option>
                <option value="spermogram">Tinh dịch đồ</option>
                <option value="other">Khác (Other)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="ml-1 text-[10px] font-black text-slate-400 uppercase">
                Ngày thực hiện
              </label>
              <Input
                name="test_date"
                type="date"
                required
                className="h-12 rounded-xl border-none bg-slate-50"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="ml-1 text-[10px] font-black text-slate-400 uppercase">
                Giá trị chỉ số
              </label>
              <Input
                name="result_value"
                placeholder="Ví dụ: 20.5"
                required
                className="h-12 rounded-xl border-none bg-slate-50 font-black text-blue-600"
              />
            </div>
            <div className="space-y-2">
              <label className="ml-1 text-[10px] font-black text-slate-400 uppercase">
                Đơn vị
              </label>
              <Input
                name="unit"
                placeholder="mIU/mL, MG/L..."
                required
                className="h-12 rounded-xl border-none bg-slate-50"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="ml-1 text-[10px] font-black text-slate-400 uppercase">
              Ngưỡng tham chiếu
            </label>
            <Input
              name="reference_range"
              placeholder="Ví dụ: 10 - 50"
              className="h-12 rounded-xl border-none bg-slate-50"
            />
          </div>
          <div className="space-y-2">
            <label className="ml-1 text-[10px] font-black text-slate-400 uppercase">
              Ghi chú bác sĩ
            </label>
            <Textarea
              name="doctor_notes"
              placeholder="Nhận định lâm sàng..."
              className="min-h-[80px] rounded-xl border-none bg-slate-50"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="h-14 w-full rounded-2xl bg-slate-900 font-black text-white shadow-xl hover:bg-slate-800"
          >
            {loading ? "ĐANG LƯU..." : "XÁC NHẬN LƯU"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddLabResultModal;
