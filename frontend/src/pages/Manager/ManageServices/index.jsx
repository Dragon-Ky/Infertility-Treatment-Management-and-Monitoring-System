import { useEffect, useState } from "react";
import {
  getAllServices,
  createService,
  updateService,
  deleteService,
  getAllServiceCategories,
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
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineSearch } from "react-icons/hi";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

function ManageServices() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    service_category_id: "",
    price: "",
    description: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [servicesData, categoriesData] = await Promise.all([
        getAllServices(),
        getAllServiceCategories(),
      ]);
      setServices(servicesData);
      setCategories(categoriesData);
    } catch (error) {
      toast.error("Không thể tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (service = null) => {
    if (service) {
      setEditingService(service);
      setFormData({
        name: service.name,
        service_category_id: service.service_category_id.toString(),
        price: service.price,
        description: service.description || "",
      });
    } else {
      setEditingService(null);
      setFormData({
        name: "",
        service_category_id: "",
        price: "",
        description: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingService) {
        await updateService(editingService.id, formData);
        toast.success("Cập nhật dịch vụ thành công!");
      } else {
        await createService(formData);
        toast.success("Thêm dịch vụ mới thành công!");
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa dịch vụ này?")) {
      try {
        await deleteService(id);
        toast.success("Đã xóa dịch vụ.");
        fetchData();
      } catch (error) {
        toast.error("Không thể xóa dịch vụ.");
      }
    }
  };

  const filteredServices = services.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">
            Quản Lý Dịch Vụ
          </h1>
          <p className="text-slate-500 font-medium">
            Thiết lập danh mục và giá cả các gói điều trị.
          </p>
        </div>
        <Button 
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-6 py-6 font-bold shadow-lg shadow-blue-200 transition-all hover:-translate-y-1"
        >
          <HiOutlinePlus className="mr-2" size={20} />
          Thêm Dịch Vụ Mới
        </Button>
      </div>

      <Card className="rounded-[32px] border-none shadow-sm overflow-hidden bg-white">
        <CardHeader className="border-b border-slate-50 p-6">
          <div className="relative max-w-md">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <Input
              placeholder="Tìm kiếm dịch vụ..."
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
                <TableHead className="font-black text-slate-400 uppercase text-xs px-6 py-4">Tên Dịch Vụ</TableHead>
                <TableHead className="font-black text-slate-400 uppercase text-xs px-6 py-4">Danh Mục</TableHead>
                <TableHead className="font-black text-slate-400 uppercase text-xs px-6 py-4">Giá (VNĐ)</TableHead>
                <TableHead className="font-black text-slate-400 uppercase text-xs px-6 py-4 text-right">Thao Tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence mode="popLayout">
                {filteredServices.map((service) => (
                  <motion.tr
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={service.id}
                    className="group border-b border-slate-50 hover:bg-blue-50/30 transition-colors"
                  >
                    <TableCell className="px-6 py-4">
                      <div className="font-bold text-slate-800">{service.name}</div>
                      <div className="text-xs text-slate-400 line-clamp-1 max-w-xs">{service.description}</div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider">
                        {service.category?.name || "N/A"}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 font-black text-blue-600">
                      {new Intl.NumberFormat("vi-VN").format(service.price)} ₫
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenModal(service)}
                        className="text-slate-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg"
                      >
                        <HiOutlinePencil size={18} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(service.id)}
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
          {filteredServices.length === 0 && !loading && (
            <div className="py-20 text-center text-slate-400 font-bold italic">
              Không tìm thấy dịch vụ nào.
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="rounded-[24px] sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-slate-800 uppercase tracking-tight">
              {editingService ? "Chỉnh Sửa Dịch Vụ" : "Thêm Dịch Vụ Mới"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Tên Dịch Vụ</label>
              <Input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="VD: IVF - Thụ tinh ống nghiệm"
                className="rounded-xl border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Danh Mục</label>
              <Select
                value={formData.service_category_id}
                onValueChange={(val) => setFormData({ ...formData, service_category_id: val })}
              >
                <SelectTrigger className="rounded-xl border-slate-200">
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Giá Dịch Vụ (VNĐ)</label>
              <Input
                required
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0"
                className="rounded-xl border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Mô Tả</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Nhập mô tả chi tiết dịch vụ..."
                className="rounded-xl border-slate-200 min-h-[100px]"
              />
            </div>
            <DialogFooter className="pt-4">
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
                {editingService ? "Lưu Thay Đổi" : "Tạo Dịch Vụ"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ManageServices;
