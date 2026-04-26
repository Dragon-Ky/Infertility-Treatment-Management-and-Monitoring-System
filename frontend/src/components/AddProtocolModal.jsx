import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  HiOutlinePlus,
  HiOutlineDocumentAdd,
  HiOutlinePencilAlt,
} from "react-icons/hi";
import { createProtocol, updateProtocol } from "@/services/protocolService";
import { getCustomers } from "@/services/doctorService";
import toast from "react-hot-toast";

function AddProtocolModal({
  onAdded,
  editData = null,
  triggerType = "button",
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);

  // Biến kiểm tra chế độ: Nếu có editData truyền vào thì là chế độ sửa
  const isEdit = !!editData;

  const [formData, setFormData] = useState({
    treatment_id: "",
    protocol_name: "",
    diagnosis: "",
    prescription: "",
    notes: "",
    is_active: true,
  });

  // Effect để load danh sách bệnh nhân và đổ dữ liệu cũ nếu là chế độ Sửa
  useEffect(() => {
    if (open) {
      const fetchPatients = async () => {
        try {
          const res = await getCustomers();
          setCustomers(res.data || []);
          // eslint-disable-next-line no-unused-vars
        } catch (error) {
          toast.error("Không thể tải danh sách bệnh nhân");
        }
      };
      fetchPatients();

      // Nếu là Sửa, đổ data từ editData vào form
      if (isEdit) {
        setFormData({
          treatment_id: String(editData.treatment_id),
          protocol_name: editData.protocol_name || "",
          diagnosis: editData.diagnosis || "",
          prescription: editData.prescription || "",
          notes: editData.notes || "",
          is_active: editData.is_active,
        });
      }
    }
  }, [open, isEdit, editData]);

  const handleSubmit = async () => {
    if (!formData.treatment_id) return toast.error("Vui lòng chọn bệnh nhân!");
    if (!formData.protocol_name)
      return toast.error("Vui lòng nhập tên phác đồ!");

    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    const doctorId = user?.id;

    if (!doctorId) {
      return toast.error("Phiên đăng nhập hết hạn!");
    }

    const dataToSend = {
      ...formData,
      treatment_id: parseInt(formData.treatment_id),
      doctor_id: doctorId,
    };

    setLoading(true);
    try {
      if (isEdit) {
        // SỬ DỤNG PHƯƠNG THỨC PATCH ĐỂ CẬP NHẬT
        await updateProtocol(editData.id, dataToSend);
        toast.success("Cập nhật phác đồ thành công!");
      } else {
        // PHƯƠNG THỨC POST ĐỂ TẠO MỚI
        await createProtocol(dataToSend);
        toast.success("Khởi tạo phác đồ thành công!");
      }

      setOpen(false);

      if (!isEdit) {
        // Reset form chỉ khi tạo mới
        setFormData({
          treatment_id: "",
          protocol_name: "",
          diagnosis: "",
          prescription: "",
          notes: "",
          is_active: true,
        });
      }

      if (onAdded) onAdded();
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
          triggerType === "menuItem" ? (
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className="cursor-pointer rounded-xl p-3 font-bold text-amber-600 focus:bg-amber-600 focus:text-white"
            >
              Chỉnh sửa phác đồ
            </DropdownMenuItem>
          ) : (
            <Button className="flex h-12 items-center gap-2 rounded-2xl bg-amber-500 px-6 text-[10px] font-black tracking-widest text-white shadow-lg shadow-amber-100 transition-all hover:bg-amber-600 active:scale-95">
              <HiOutlinePencilAlt size={18} />
              Chỉnh sửa hồ sơ
            </Button>
          )
        ) : (
          <Button className="h-14 rounded-2xl bg-slate-900 px-8 font-black text-white shadow-xl transition-all hover:bg-slate-800 active:scale-95">
            <HiOutlinePlus size={20} className="mr-2" />
            TẠO PHÁC ĐỒ MỚI
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="z-[9999] max-h-[90vh] max-w-2xl overflow-y-auto rounded-[32px] border-none p-8 shadow-2xl [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <DialogHeader>
          <div
            className={`mb-2 flex items-center gap-3 ${isEdit ? "text-amber-600" : "text-blue-600"}`}
          >
            <HiOutlineDocumentAdd size={28} />
            <DialogTitle className="text-2xl font-black tracking-tighter text-slate-800 uppercase">
              {isEdit ? "Cập nhật phác đồ" : "Khởi tạo phác đồ điều trị"}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-5 py-6">
          <div className="space-y-2">
            <label className="ml-2 text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Bệnh nhân chỉ định
            </label>
            <Select
              value={formData.treatment_id}
              onValueChange={(val) =>
                setFormData({ ...formData, treatment_id: val })
              }
              disabled={isEdit}
            >
              <SelectTrigger className="h-14 rounded-2xl border-none bg-slate-50 font-bold focus:ring-2 focus:ring-blue-500">
                <SelectValue placeholder="Chọn bệnh nhân từ Auth Service..." />
              </SelectTrigger>
              <SelectContent className="z-[10000] rounded-xl border-none bg-white p-2 shadow-2xl">
                {customers.map((c) => (
                  <SelectItem
                    key={c.id}
                    value={String(c.id)}
                    className="cursor-pointer rounded-lg py-3 font-bold transition-colors focus:bg-blue-600 focus:text-white"
                  >
                    {c.name} - {c.phone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="ml-2 text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Tên phác đồ
            </label>
            <Input
              placeholder="VD: Phác đồ IVF chu kỳ 1"
              value={formData.protocol_name}
              onChange={(e) =>
                setFormData({ ...formData, protocol_name: e.target.value })
              }
              className="h-14 rounded-2xl border-none bg-slate-50 font-bold focus-visible:ring-2 focus-visible:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="ml-2 text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Chẩn đoán ban đầu
            </label>
            <Textarea
              placeholder="Nhập nội dung bệnh lý..."
              value={formData.diagnosis}
              onChange={(e) =>
                setFormData({ ...formData, diagnosis: e.target.value })
              }
              className="min-h-[100px] rounded-2xl border-none bg-slate-50 font-bold focus-visible:ring-2 focus-visible:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="ml-2 text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Chỉ định thuốc chính
            </label>
            <Input
              placeholder="Tên thuốc và liều lượng..."
              value={formData.prescription}
              onChange={(e) =>
                setFormData({ ...formData, prescription: e.target.value })
              }
              className="h-14 rounded-2xl border-none bg-slate-50 font-black text-blue-600 uppercase italic focus-visible:ring-2 focus-visible:ring-blue-500"
            />
          </div>
        </div>

        <DialogFooter className="pt-4">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className={`h-14 w-full rounded-2xl font-black tracking-[0.2em] text-white uppercase shadow-xl transition-all active:scale-95 ${
              isEdit
                ? "bg-amber-500 hover:bg-amber-600"
                : "bg-slate-900 hover:bg-blue-600"
            }`}
          >
            {loading ? "ĐANG XỬ LÝ..." : isEdit ? "CẬP NHẬT NGAY" : "XÁC NHẬN"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddProtocolModal;
