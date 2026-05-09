import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getPostDetail } from "@/services/blogService";
import { FaCalendarAlt, FaUser, FaChevronLeft } from "react-icons/fa";
import { BlogSkeleton } from "@/components/Loading";

function BlogDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const result = await getPostDetail(id);
        setPost(result.data);
      } catch (error) {
        console.error("Lỗi lấy chi tiết bài viết:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return <BlogSkeleton />;
  if (!post)
    return <div className="py-20 text-center">Không tìm thấy bài viết.</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="sticky top-0 z-10 border-b bg-white py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6">
          <Link
            to="/blog"
            className="flex items-center gap-2 font-medium text-blue-600"
          >
            <FaChevronLeft /> Quay lại
          </Link>
          <div className="text-sm text-gray-400">
            Chuyên mục: Kiến thức y khoa
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-4xl overflow-hidden rounded-xl bg-white shadow-sm">
        <img
          src={post.image}
          alt={post.title}
          className="h-100 w-full object-cover"
        />

        <div className="p-10">
          <h1 className="mb-6 text-4xl leading-tight font-extrabold text-gray-900">
            {post.title}
          </h1>

          <div className="mb-8 flex items-center gap-4 border-b border-gray-100 pb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-600">
              {post.user?.name.charAt(0)}
            </div>
            <div>
              <div className="font-bold text-gray-800">{post.user?.name}</div>
              <div className="text-sm text-gray-500">
                Đăng ngày:{" "}
                {new Date(post.created_at).toLocaleDateString("vi-VN")}
              </div>
            </div>
          </div>

          <div
            className="space-y-6 text-lg leading-relaxed whitespace-pre-line text-gray-700"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {post.content}
          </div>

          <div className="mt-16 rounded-2xl border border-blue-100 bg-blue-50 p-8">
            <h3 className="mb-2 text-xl font-bold text-blue-800">
              Bạn cần tư vấn chuyên sâu?
            </h3>
            <p className="mb-4 text-blue-700">
              Mọi thắc mắc về lộ trình điều trị hiếm muộn, hãy đặt lịch hẹn trực
              tiếp với các chuyên gia của chúng tôi.
            </p>
            <Link
              to="/customer/appointments"
              className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-bold text-white transition-colors hover:bg-blue-700"
            >
              Đặt lịch khám ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogDetail;
