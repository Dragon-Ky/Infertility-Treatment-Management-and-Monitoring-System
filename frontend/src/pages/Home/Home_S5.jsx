import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllPosts } from "@/services/blogService";

function Home_S5() {
  const [blogHome, setBlogHome] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const result = await getAllPosts();
        setBlogHome(result.data.slice(0, 3));
      } catch (error) {
        console.error("Lỗi khi gọi API Blog ở trang chủ:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-500">Đang tải tin tức...</div>
    );
  }

  return (
    <div className="bg-(--bg-section) py-20">
      <div className="mx-auto max-w-7xl">
        <div className="box-head">Blog & Tin tức</div>
        <div className="mb-9 text-center text-[1vw]">
          Kiến thức chuyên khoa và những câu chuyện truyền cảm hứng
        </div>

        <div className="grid grid-cols-3 gap-4">
          {blogHome.map((blog) => (
            <div className="cursor-pointer" key={blog.id}>
              <img
                className="mb-4 h-[50vh] w-[30vw] rounded-lg object-cover"
                src={blog.image || "https://via.placeholder.com/400x300"}
                alt={blog.title}
              />
              <p className="mb-2 line-clamp-2 px-2 text-center font-bold">
                {blog.title}
              </p>

              <p className="line-clamp-3 min-h-[12vh] px-4 text-center text-sm text-gray-600">
                {blog.content}
              </p>

              <Link to={`/blog/${blog.id}`}>
                <button className="hv-transition mx-auto flex cursor-pointer rounded-lg border bg-(--primary-bold) px-[1vw] py-[0.8vh] font-semibold text-white hover:border-(--primary-bold) hover:bg-transparent hover:text-(--primary-bold)">
                  Đọc thêm
                </button>
              </Link>
            </div>
          ))}
        </div>

        {blogHome.length === 0 && (
          <div className="text-center text-gray-400">
            Hiện chưa có bài viết mới nhất.
          </div>
        )}
      </div>
    </div>
  );
}

export default Home_S5;
