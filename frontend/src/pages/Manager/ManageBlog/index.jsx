import { useEffect, useState } from "react";
import { getAllPosts, deletePost } from "@/services/blogService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  HiOutlinePencilAlt,
  HiOutlineTrash,
  HiOutlinePlus,
  HiOutlineBookOpen,
} from "react-icons/hi";
import BlogModal from "@/components/BlogModal";
import toast from "react-hot-toast";

function ManageBlog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await getAllPosts();
      setPosts(res.data || []);
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error("Không thể tải danh sách bài viết!");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setSelectedPost(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deletePost(id);
      toast.success("Đã xóa bài viết thành công!");
      fetchPosts();
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error("Lỗi khi xóa bài viết!");
    }
  };

  return (
    <div className="animate-in fade-in zoom-in-95 min-h-screen space-y-8 bg-slate-50 p-6 duration-500 md:p-8">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-black tracking-tighter text-slate-900 uppercase">
            <div className="rounded-2xl bg-blue-600 p-2 shadow-lg shadow-blue-200">
              <HiOutlineBookOpen className="text-white" size={28} />
            </div>
            Quản lý Bài viết
          </h1>
          <p className="mt-1 font-medium text-slate-500">
            Nội dung chia sẻ kiến thức y khoa trên hệ thống
          </p>
        </div>

        <Button
          onClick={handleOpenAdd}
          className="h-14 cursor-pointer rounded-2xl bg-slate-900 px-8 font-black text-white shadow-xl transition-all hover:bg-slate-800 active:scale-95"
        >
          <HiOutlinePlus size={20} className="mr-2" /> TẠO BÀI VIẾT MỚI
        </Button>
      </div>

      <Card className="overflow-hidden rounded-[32px] border-none bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="p-6 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                Bài viết
              </TableHead>
              <TableHead className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                Tác giả
              </TableHead>
              <TableHead className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                Ngày đăng
              </TableHead>
              <TableHead className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                Lượt xem
              </TableHead>
              <TableHead className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                Trạng thái
              </TableHead>
              <TableHead className="pr-8 text-right text-[10px] font-black tracking-widest text-slate-400 uppercase">
                Thao tác
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                    <span className="font-bold text-slate-400">
                      Đang tải bài viết...
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => (
                <TableRow
                  key={post.id}
                  className="group border-b border-slate-50 hover:bg-slate-50/50"
                >
                  <TableCell className="p-6">
                    <div className="flex items-center gap-4">
                      <img
                        src={post.image}
                        className="h-12 w-12 rounded-xl object-cover shadow-sm"
                        alt="thumb"
                        onError={(e) =>
                          (e.target.src = "https://via.placeholder.com/150")
                        }
                      />
                      <div>
                        <div className="line-clamp-1 font-black text-slate-800">
                          {post.title}
                        </div>
                        <div className="text-[11px] font-bold tracking-tight text-blue-600 uppercase">
                          Blog Y Khoa
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-600">
                        {post.user?.name?.[0] || "U"}
                      </div>
                      <span className="text-sm font-bold text-slate-600">
                        {post.user?.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs font-bold text-slate-400">
                    {new Date(post.created_at).toLocaleDateString("vi-VN")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="rounded-lg border-slate-200 font-bold text-slate-500"
                    >
                      {post.views || 0} lượt xem
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className="rounded-xl border-none bg-green-100 px-3 py-1 text-[10px] font-black text-green-700 shadow-none">
                      CÔNG KHAI
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-8 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenEdit(post)}
                        className="h-9 w-9 rounded-xl text-amber-500 hover:bg-amber-50 hover:text-amber-600"
                      >
                        <HiOutlinePencilAlt size={18} />
                      </Button>
                      <DeleteConfirm
                        description={`bài viết "${post.title}"`}
                        onConfirm={() => handleDelete(post.id)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <BlogModal
        open={isModalOpen}
        setOpen={setIsModalOpen}
        onRefresh={fetchPosts}
        editData={selectedPost}
      />
    </div>
  );
}

export default ManageBlog;
