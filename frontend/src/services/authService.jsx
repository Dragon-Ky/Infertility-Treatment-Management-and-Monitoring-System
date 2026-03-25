import api from "../utils/api";

// Login
export const loginApi = async (email, password) => {
  // Laravel  đợi nhận POST data
  const response = await api.post("login", { email, password });
  return response.data; // Axios tự động parse JSON
};

// Lấy thông tin User hiện tại (Dùng token đã lưu để lấy)
export const getProfile = async () => {
  const response = await api.get("me"); // Endpoint lấy thông tin cá nhân
  return response.data;
};
