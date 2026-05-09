import { useEffect, useState } from "react";
import {
  getAllDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} from "@/services/catalogService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineSearch } from "react-icons/hi";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

function ManageDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [formData, setFormData] = useState({
    full_name: "",
    avatar: "",
    degree: "",
    specialization: "",
    experience_years: "",
    consultation_fee: "",
    bio: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getAllDoctors();
      const doctorsData = Array.isArray(data) ? data : (data.data || []);
      setDoctors(doctorsData);
    } catch (error) {
      toast.error("Không thể tải danh sách bác sĩ.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (doctor = null) => {
    if (doctor) {
      setEditingDoctor(doctor);
      setFormData({
        full_name: doctor.full_name,
        avatar: doctor.avatar || "",
        degree: doctor.degree || "",
        specialization: doctor.specialization || "",
        experience_years: doctor.experience_years?.toString() || "0",
        consultation_fee: doctor.consultation_fee?.toString() || "0",
        bio: doctor.bio || "",
      });
    } else {
      setEditingDoctor(null);
      setFormData({
        full_name: "",
        avatar: "",
        degree: "",
        specialization: "",
        experience_years: "0",
        consultation_fee: "0",
        bio: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        experience_years: parseInt(formData.experience_years) || 0,
        consultation_fee: parseFloat(formData.consultation_fee) || 0,
      };

      if (editingDoctor) {
        await updateDoctor(editingDoctor.id, payload);
        toast.success("Cập nhật thông tin bác sĩ thành công!");
      } else {
        await createDoctor(payload);
        toast.success("Thêm bác sĩ mới thành công!");
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Lỗi khi cập nhật BS:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bác sĩ này khỏi danh sách?")) {
      try {
        await deleteDoctor(id);
        toast.success("Đã xóa bác sĩ.");
        fetchData();
      } catch (error) {
        toast.error("Không thể xóa bác sĩ.");
      }
    }
  };

  const filteredDoctors = doctors.filter((d) =>
    d.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">
            Quản Lý Đội Ngũ Y Tế
          </h1>
          <p className="text-slate-500 font-medium">
            Quản lý hồ sơ chuyên môn và thông tin các bác sĩ.
          </p>
        </div>
        <Button 
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-6 py-6 font-bold shadow-lg shadow-blue-200 transition-all hover:-translate-y-1"
        >
          <HiOutlinePlus className="mr-2" size={20} />
          Thêm Bác Sĩ Mới
        </Button>
      </div>

      <Card className="rounded-[32px] border-none shadow-sm overflow-hidden bg-white">
        <CardHeader className="border-b border-slate-50 p-6">
          <div className="relative max-w-md">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <Input
              placeholder="Tìm tên bác sĩ hoặc chuyên khoa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-xl border-slate-200 bg-slate-50 focus:bg-white transition-all"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-none">
                <TableHead className="font-black text-slate-400 uppercase text-xs px-6 py-4">Bác Sĩ</TableHead>
                <TableHead className="font-black text-slate-400 uppercase text-xs px-6 py-4">Chuyên Khoa</TableHead>
                <TableHead className="font-black text-slate-400 uppercase text-xs px-6 py-4">Kinh Nghiệm</TableHead>
                <TableHead className="font-black text-slate-400 uppercase text-xs px-6 py-4">Phí Khám</TableHead>
                <TableHead className="font-black text-slate-400 uppercase text-xs px-6 py-4 text-right">Thao Tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence mode="popLayout">
                {filteredDoctors.map((doc) => (
                  <motion.tr
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={doc.id}
                    className="group border-b border-slate-50 hover:bg-blue-50/30 transition-colors"
                  >
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={doc.avatar || "https://via.placeholder.com/100"} 
                          alt={doc.full_name}
                          className="h-10 w-10 rounded-full object-cover shadow-sm border border-slate-200"
                        />
                        <div>
                          <div className="font-bold text-slate-800">{doc.degree} {doc.full_name}</div>
                          <div className="text-xs text-slate-400">ID: #{doc.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <span className="font-medium text-slate-600">{doc.specialization}</span>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase">
                        {doc.experience_years} Năm
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 font-black text-slate-700">
                      {new Intl.NumberFormat("vi-VN").format(doc.consultation_fee)} ₫
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenModal(doc)}
                        className="text-slate-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg"
                      >
                        <HiOutlinePencil size={18} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(doc.id)}
                        className="text-slate-400 hover:text-red-600 hover:bg-red-100 rounded-lg"
                      >
                        <HiOutlineTrash size={18} />
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
          {filteredDoctors.length === 0 && !loading && (
            <div className="py-20 text-center text-slate-400 font-bold italic">
              Không tìm thấy bác sĩ nào.
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="rounded-[24px] sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-slate-800 uppercase tracking-tight">
              {editingDoctor ? "Chỉnh Sửa Hồ Sơ Bác Sĩ" : "Thêm Bác Sĩ Mới"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Họ và Tên</label>
              <Input
                required
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="VD: Nguyễn Văn A"
                className="rounded-xl border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Học hàm / Học vị</label>
              <Input
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                placeholder="VD: ThS.BS, TS.BS"
                className="rounded-xl border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Chuyên Khoa</label>
              <Input
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                placeholder="VD: Hỗ trợ sinh sản"
                className="rounded-xl border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Số năm kinh nghiệm</label>
              <Input
                type="number"
                value={formData.experience_years}
                onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
                className="rounded-xl border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Phí tư vấn (VNĐ)</label>
              <Input
                type="number"
                value={formData.consultation_fee}
                onChange={(e) => setFormData({ ...formData, consultation_fee: e.target.value })}
                className="rounded-xl border-slate-200"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Link ảnh đại diện (URL)</label>
              <Input
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                placeholder="https://example.com/avatar.jpg"
                className="rounded-xl border-slate-200"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Giới thiệu bản thân</label>
              <Textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Nhập thông tin giới thiệu chi tiết về bác sĩ..."
                className="rounded-xl border-slate-200 min-h-[100px]"
              />
            </div>
            <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t border-slate-100 mt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl font-bold text-slate-500"
              >
                Hủy Bỏ
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold px-8 shadow-lg shadow-blue-100"
              >
                {editingDoctor ? "Lưu Thay Đổi" : "Tạo Hồ Sơ"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ManageDoctors;
