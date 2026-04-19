import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/", // URL Laravel
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ĐÍNH KÈM TOKEN: Tự động thêm Token vào mỗi request nếu có
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Xử lý lỗi toàn cục
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Kiểm tra nếu lỗi là 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      if (!window.location.pathname.includes("/login")) {
        // Xóa dữ liệu rác
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");

        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");

        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
