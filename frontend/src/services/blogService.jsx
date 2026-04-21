import api from "../utils/auth-service/api";

// Lấy danh sách toàn bộ bài viết (Mục 4 & 5)
export const getAllPosts = async () => {
  const response = await api.get("posts");
  return response.data; // Trả về { status: 'success', data: [...] }
};

// Xem chi tiết một bài viết
export const getPostDetail = async (id) => {
  const response = await api.get(`posts/${id}`);
  return response.data;
};

// Đăng bài viết mới (Dành cho Admin/Manager/Doctor)
export const createPost = async (postData) => {
  const response = await api.post("posts", postData);
  return response.data;
};
