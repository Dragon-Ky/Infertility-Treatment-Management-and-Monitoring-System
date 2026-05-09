import React, { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaUser,
  FaArrowRight,
  FaBookOpen,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { getAllPosts } from "@/services/blogService";
import { BlogSkeleton } from "@/components/Loading";

function BlogList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const result = await getAllPosts();
        setPosts(result.data || []);
      } catch (error) {
        console.error("Lỗi lấy danh sách blog:", error);
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="container mx-auto max-w-6xl p-6">
      <div className="mb-10 flex items-center justify-between border-b pb-6">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
            <FaBookOpen className="text-3xl" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              Kiến thức Y khoa
            </h1>
            <p className="font-medium text-slate-500">
              Cập nhật những thông tin mới nhất về hỗ trợ sinh sản
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <BlogSkeleton key={index} />
            ))
          : posts.map((post) => (
              <article
                key={post.id}
                className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={
                      post.image ||
                      "https://via.placeholder.com/400x200?text=Infertility+Care"
                    }
                    alt={post.title}
                    className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="rounded-lg bg-white/90 px-3 py-1 text-xs font-black text-blue-600 uppercase backdrop-blur-md">
                      Y học
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-4 flex items-center gap-4 text-[13px] font-bold text-slate-400">
                    <span className="flex items-center gap-1.5 transition-colors group-hover:text-blue-600">
                      <FaUser className="text-[10px]" />{" "}
                      {post.user?.name || "Bác sĩ chuyên khoa"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FaCalendarAlt className="text-[10px]" />{" "}
                      {new Date(post.created_at).toLocaleDateString("vi-VN")}
                    </span>
                  </div>

                  <h2 className="mb-3 line-clamp-2 text-xl leading-tight font-black text-slate-800 transition-colors group-hover:text-blue-600">
                    {post.title}
                  </h2>

                  <p className="mb-6 line-clamp-3 text-[14px] leading-relaxed text-slate-500">
                    {post.content.replace(/<[^>]*>?/gm, "").substring(0, 100)}
                    ...
                  </p>

                  <Link
                    to={`/blog/${post.id}`}
                    className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 font-bold text-slate-700 transition-all hover:bg-blue-600 hover:text-white"
                  >
                    <span>Đọc bài viết</span>
                    <FaArrowRight className="text-xs" />
                  </Link>
                </div>
              </article>
            ))}
      </div>

      {!loading && posts.length === 0 && (
        <div className="mt-20 flex flex-col items-center justify-center text-center">
          <div className="mb-4 text-6xl opacity-20">📂</div>
          <h3 className="text-xl font-bold text-slate-400">
            Chưa có bài viết nào được đăng.
          </h3>
        </div>
      )}
    </div>
  );
}

export default BlogList;
