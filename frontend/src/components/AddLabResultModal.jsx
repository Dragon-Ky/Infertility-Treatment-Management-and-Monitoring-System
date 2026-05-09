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
import { createLabResult, updateLabResult } from "@/services/labService";
import {
  HiOutlinePlus,
  HiOutlineBeaker,
  HiOutlinePencilAlt,
} from "react-icons/hi";
import toast from "react-hot-toast";

const AddLabResultModal = ({ protocol, onAdded, editData = null }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const isEdit = !!editData;

  const [formData, setFormData] = useState({
    test_type: "blood",
    test_date: "",
    result_value: "",
    unit: "",
    reference_range: "",
    doctor_notes: "",
  });

  // Đổ dữ liệu khi ở chế độ Edit
  useEffect(() => {
    if (open && editData) {
      setFormData({
        test_type: editData.test_type || "blood",
        test_date: editData.test_date || "",
        result_value: editData.result_data ? editData.result_data[0] : "",
        unit: editData.unit || "",
        reference_range: editData.reference_range || "",
        doctor_notes: editData.doctor_notes || "",
      });
    } else if (open && !isEdit) {
      setFormData({
        test_type: "blood",
        test_date: "",
        result_value: "",
        unit: "",
        reference_range: "",
        doctor_notes: "",
      });
    }
  }, [open, editData, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      treatment_id: protocol.id,
      test_type: formData.test_type,
      test_date: formData.test_date,
      result_data: [formData.result_value],
      unit: formData.unit,
      reference_range: formData.reference_range,
      doctor_notes: formData.doctor_notes,
    };

    setLoading(true);
    try {
      if (isEdit) {
        await updateLabResult(editData.id, data);
        toast.success("Đã cập nhật kết quả xét nghiệm!");
      } else {
        await createLabResult(data);
        toast.success("Đã lưu kết quả xét nghiệm!");
      }
      setOpen(false);
      onAdded();
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Thao tác thất bại!";
      toast.error(errorMsg);
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
            <HiOutlinePlus className="mr-2" size={18} /> Nhập kết quả
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="z-[9999] rounded-[32px] border-none p-8 sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle
            className={`flex items-center gap-2 text-2xl font-black tracking-tighter text-slate-800 uppercase`}
          >
            <HiOutlineBeaker
              className={isEdit ? "text-amber-600" : "text-blue-600"}
            />
            {isEdit ? "Chỉnh sửa xét nghiệm" : "Ghi nhận xét nghiệm"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="ml-1 text-[10px] font-black text-slate-400 uppercase">
                Loại xét nghiệm
              </label>
              <Select
                value={formData.test_type}
                onValueChange={(val) =>
                  setFormData({ ...formData, test_type: val })
                }
              >
                <SelectTrigger className="h-12 w-full cursor-pointer rounded-xl border-none bg-slate-50 px-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500">
                  <SelectValue placeholder="Chọn loại..." />
                </SelectTrigger>
                <SelectContent className="z-[10001] rounded-xl border-none bg-white p-2 shadow-2xl">
                  <SelectItem
                    value="blood"
                    className="cursor-pointer rounded-lg font-bold focus:bg-blue-600 focus:text-white"
                  >
                    Máu (Blood)
                  </SelectItem>
                  <SelectItem
                    value="hormone"
                    className="cursor-pointer rounded-lg font-bold focus:bg-blue-600 focus:text-white"
                  >
                    Nội tiết (Hormone)
                  </SelectItem>
                  <SelectItem
                    value="ultrasound"
                    className="cursor-pointer rounded-lg font-bold focus:bg-blue-600 focus:text-white"
                  >
                    Siêu âm (Ultrasound)
                  </SelectItem>
                  <SelectItem
                    value="spermogram"
                    className="cursor-pointer rounded-lg font-bold focus:bg-blue-600 focus:text-white"
                  >
                    Tinh dịch đồ
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
            <div className="space-y-2">
              <label className="ml-1 text-[10px] font-black text-slate-400 uppercase">
                Ngày thực hiện
              </label>
              <Input
                type="date"
                value={formData.test_date}
                onChange={(e) =>
                  setFormData({ ...formData, test_date: e.target.value })
                }
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
                placeholder="Ví dụ: 20.5"
                value={formData.result_value}
                onChange={(e) =>
                  setFormData({ ...formData, result_value: e.target.value })
                }
                required
                className="h-12 rounded-xl border-none bg-slate-50 font-black text-blue-600"
              />
            </div>
            <div className="space-y-2">
              <label className="ml-1 text-[10px] font-black text-slate-400 uppercase">
                Đơn vị
              </label>
              <Input
                placeholder="mIU/mL..."
                value={formData.unit}
                onChange={(e) =>
                  setFormData({ ...formData, unit: e.target.value })
                }
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
              placeholder="Ví dụ: 10 - 50"
              value={formData.reference_range}
              onChange={(e) =>
                setFormData({ ...formData, reference_range: e.target.value })
              }
              className="h-12 rounded-xl border-none bg-slate-50"
            />
          </div>

          <div className="space-y-2">
            <label className="ml-1 text-[10px] font-black text-slate-400 uppercase">
              Ghi chú bác sĩ
            </label>
            <Textarea
              placeholder="Nhận định lâm sàng..."
              value={formData.doctor_notes}
              onChange={(e) =>
                setFormData({ ...formData, doctor_notes: e.target.value })
              }
              className="min-h-[80px] rounded-xl border-none bg-slate-50"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className={`h-14 w-full cursor-pointer rounded-2xl bg-slate-900 font-black text-white shadow-xl transition-all ${
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

export default AddLabResultModal;
