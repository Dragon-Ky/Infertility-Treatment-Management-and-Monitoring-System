import api from "../utils/auth-service/api";

export const getAllPosts = async () => {
  const response = await api.get("posts");
  return response.data; // Trả về { status: 'success', data: [...] }
};

export const getPostDetail = async (id) => {
  const response = await api.get(`posts/${id}`);
  return response.data;
};

// Đăng bài viết mới (Dành cho Admin/Manager/Doctor)
export const createPost = async (postData) => {
  const response = await api.post("posts", postData);
  return response.data;
};

export const updatePost = async (id, postData) => {
  const response = await api.put(`posts/${id}`, postData);
  return response.data;
};

export const deletePost = async (id) => {
  const response = await api.delete(`posts/${id}`);
  return response.data;
};
