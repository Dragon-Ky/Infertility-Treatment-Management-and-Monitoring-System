import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { HiOutlineDocumentText, HiOutlinePencilAlt } from "react-icons/hi";
import { createPost, updatePost } from "@/services/blogService";
import toast from "react-hot-toast";

function BlogModal({ open, setOpen, onRefresh, editData = null }) {
  const [loading, setLoading] = useState(false);
  const isEdit = !!editData;

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: "",
    excerpt: "",
  });

  useEffect(() => {
    if (open) {
      if (isEdit) {
        setFormData({
          title: editData.title || "",
          content: editData.content || "",
          image: editData.image || "",
          excerpt: editData.excerpt || "",
        });
      } else {
        setFormData({ title: "", content: "", image: "", excerpt: "" });
      }
    }
  }, [open, isEdit, editData]);

  const handleSubmit = async () => {
    if (!formData.title || !formData.content)
      return toast.error("Vui lòng điền đủ thông tin!");

    setLoading(true);
    try {
      if (isEdit) {
        await updatePost(editData.id, formData);
        toast.success("Cập nhật bài viết thành công!");
      } else {
        await createPost(formData);
        toast.success("Đăng bài viết mới thành công!");
      }
      setOpen(false);
      onRefresh();
    } catch (error) {
      toast.error(error.response?.data?.message || "Thao tác thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl rounded-[32px] border-none p-8 shadow-2xl">
        <DialogHeader>
          <div
            className={`flex items-center gap-3 ${isEdit ? "text-amber-600" : "text-blue-600"}`}
          >
            {isEdit ? (
              <HiOutlinePencilAlt size={28} />
            ) : (
              <HiOutlineDocumentText size={28} />
            )}
            <DialogTitle className="text-2xl font-black uppercase">
              {isEdit ? "Chỉnh sửa bài viết" : "Viết bài chia sẻ mới"}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <label className="ml-2 text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Tiêu đề
            </label>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="h-12 rounded-xl border-none bg-slate-50 font-bold"
            />
          </div>
          <div>
            <label className="ml-2 text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Link Ảnh (URL)
            </label>
            <Input
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
              className="h-12 rounded-xl border-none bg-slate-50"
            />
          </div>
          <div>
            <label className="ml-2 text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Nội dung chi tiết
            </label>
            <Textarea
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              className="min-h-[200px] rounded-xl border-none bg-slate-50"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className={`h-14 w-full rounded-2xl font-black text-white transition-all ${isEdit ? "bg-amber-500 hover:bg-amber-600" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {loading
              ? "ĐANG XỬ LÝ..."
              : isEdit
                ? "CẬP NHẬT NGAY"
                : "XUẤT BẢN BÀI VIẾT"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default BlogModal;
