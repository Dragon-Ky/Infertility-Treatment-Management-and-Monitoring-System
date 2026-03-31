import React, { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaUser,
  FaArrowRight,
  FaBookOpen,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { getAllPosts } from "@/services/blogService";

function BlogList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const result = await getAllPosts();
        setPosts(result.data);
      } catch (error) {
        console.error("Lỗi lấy danh sách blog:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading)
    return <div className="mt-20 text-center">Đang tải bài viết...</div>;

  return (
    <div className="container mx-auto max-w-6xl p-6">
      <div className="mb-10 flex items-center gap-3 border-b pb-4">
        <FaBookOpen className="text-3xl text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-800">
          Kiến thức Y khoa & Kinh nghiệm
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <div
            key={post.id}
            className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            <img
              src={
                post.image ||
                "https://via.placeholder.com/400x200?text=Infertility+Care"
              }
              alt={post.title}
              className="h-48 w-full object-cover"
            />

            <div className="p-5">
              <div className="mb-3 flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <FaUser /> {post.user?.name}
                </span>
                <span className="flex items-center gap-1">
                  <FaCalendarAlt />{" "}
                  {new Date(post.created_at).toLocaleDateString("vi-VN")}
                </span>
              </div>

              <h2 className="mb-3 line-clamp-2 text-xl font-bold text-gray-800">
                {post.title}
              </h2>

              <p className="mb-5 line-clamp-3 text-sm text-gray-600">
                {post.content.substring(0, 120)}...
              </p>

              <Link
                to={`/blog/${post.id}`}
                className="inline-flex items-center gap-2 font-semibold text-blue-600 transition-all hover:gap-3"
              >
                Đọc tiếp <FaArrowRight />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="mt-10 text-center text-gray-500">
          Chưa có bài viết nào được đăng.
        </div>
      )}
    </div>
  );
}

export default BlogList;
