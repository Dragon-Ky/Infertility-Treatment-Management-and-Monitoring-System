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

const TREATMENT_PACKAGES = [
  { name: "Khám & Đánh giá Hiếm muộn cơ bản", price: 5000000 },
  { name: "Phác đồ IUI (Bơm tinh trùng vào buồng tử cung)", price: 15000000 },
  {
    name: "Phác đồ IVF Tiêu chuẩn (Thụ tinh trong ống nghiệm)",
    price: 80000000,
  },
  {
    name: "Phác đồ IVF + ICSI (Tiêm tinh trùng vào bào tương trứng)",
    price: 100000000,
  },
  {
    name: "Phác đồ IVF Toàn diện (Kèm sàng lọc di truyền phôi PGT)",
    price: 150000000,
  },
  { name: "Gói Trữ đông trứng / Trữ đông tinh trùng (1 năm)", price: 20000000 },
  { name: "Chuyển phôi đông lạnh (FET)", price: 25000000 },
];

function AddProtocolModal({
  onAdded,
  editData = null,
  triggerType = "button",
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);

  const isEdit = !!editData;

  const [formData, setFormData] = useState({
    treatment_id: "",
    protocol_name: "",
    price: 0,
    diagnosis: "",
    prescription: "",
    notes: "",
    is_active: true,
  });

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

      if (isEdit) {
        setFormData({
          treatment_id: String(editData.treatment_id),
          protocol_name: editData.protocol_name || "",
          price: editData.price || 0,
          diagnosis: editData.diagnosis || "",
          prescription: editData.prescription || "",
          notes: editData.notes || "",
          is_active: editData.is_active,
        });
      }
    }
  }, [open, isEdit, editData]);

  const handleSelectPackage = (val) => {
    const selectedPackage = TREATMENT_PACKAGES.find((pkg) => pkg.name === val);
    if (selectedPackage) {
      setFormData({
        ...formData,
        protocol_name: selectedPackage.name,
        price: selectedPackage.price,
      });
    }
  };

  const handleSubmit = async () => {
    if (!formData.treatment_id) return toast.error("Vui lòng chọn bệnh nhân!");
    if (!formData.protocol_name)
      return toast.error("Vui lòng chọn gói điều trị!");

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
        await updateProtocol(editData.id, dataToSend);
        toast.success("Cập nhật phác đồ thành công!");
      } else {
        await createProtocol(dataToSend);
        toast.success("Khởi tạo phác đồ thành công!");
      }

      setOpen(false);

      if (!isEdit) {
        setFormData({
          treatment_id: "",
          protocol_name: "",
          price: 0,
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
            <Button className="flex h-12 cursor-pointer items-center gap-2 rounded-2xl bg-amber-500 px-6 text-[10px] font-black tracking-widest text-white shadow-lg shadow-amber-100 transition-all hover:bg-amber-600 active:scale-95">
              <HiOutlinePencilAlt size={18} />
              Chỉnh sửa hồ sơ
            </Button>
          )
        ) : (
          <Button className="h-14 cursor-pointer rounded-2xl bg-slate-900 px-8 font-black text-white shadow-xl transition-all hover:bg-slate-800 active:scale-95">
            <HiOutlinePlus size={20} className="mr-2" />
            TẠO PHÁC ĐỒ MỚI
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="z-[9999] max-h-[90vh] w-[95vw] overflow-x-hidden overflow-y-auto rounded-[32px] border-none p-6 shadow-2xl [-ms-overflow-style:none] [scrollbar-width:none] sm:!max-w-[700px] md:p-8 [&::-webkit-scrollbar]:hidden">
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
              <SelectTrigger className="h-14 w-full min-w-0 rounded-2xl border-none bg-slate-50 font-bold focus:ring-2 focus:ring-blue-500 [&>span]:truncate [&>span]:text-left">
                <SelectValue placeholder="Chọn bệnh nhân từ Auth Service..." />
              </SelectTrigger>
              <SelectContent className="z-[10000] w-full rounded-xl border-none bg-white p-2 shadow-2xl">
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
              Gói điều trị (Phác đồ) <span className="text-red-500">*</span>
            </label>
            <Select
              value={formData.protocol_name}
              onValueChange={handleSelectPackage}
            >
              <SelectTrigger className="h-14 w-full min-w-0 rounded-2xl border-none bg-slate-50 font-bold focus:ring-2 focus:ring-blue-500 [&>span]:truncate [&>span]:text-left">
                <SelectValue placeholder="-- Chọn gói điều trị & Báo giá --" />
              </SelectTrigger>
              <SelectContent className="z-[10000] w-full rounded-xl border-none bg-white p-2 shadow-2xl">
                {TREATMENT_PACKAGES.map((pkg, idx) => (
                  <SelectItem
                    key={idx}
                    value={pkg.name}
                    className="cursor-pointer rounded-lg py-3 text-left font-bold break-words whitespace-normal transition-colors focus:bg-blue-600 focus:text-white"
                  >
                    {pkg.name} -{" "}
                    <span className="text-blue-600 group-hover:text-white">
                      {new Intl.NumberFormat("vi-VN").format(pkg.price)} VNĐ
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {formData.price > 0 && (
              <p className="mt-2 ml-2 text-[11px] font-bold text-green-600">
                Doanh thu dự kiến:{" "}
                {new Intl.NumberFormat("vi-VN").format(formData.price)} VNĐ
              </p>
            )}
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
              className="min-h-[100px] w-full rounded-2xl border-none bg-slate-50 font-bold focus-visible:ring-2 focus-visible:ring-blue-500"
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
              className="h-14 w-full rounded-2xl border-none bg-slate-50 font-black text-blue-600 uppercase italic focus-visible:ring-2 focus-visible:ring-blue-500"
            />
          </div>
        </div>

        <DialogFooter className="pt-4">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className={`h-14 w-full cursor-pointer rounded-2xl font-black tracking-[0.2em] text-white uppercase shadow-xl transition-all active:scale-95 ${
              isEdit
                ? "bg-amber-500 hover:bg-amber-600"
                : "bg-blue-600 hover:bg-blue-700"
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
