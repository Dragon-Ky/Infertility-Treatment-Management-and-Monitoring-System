import axios from "axios";
import toast from "react-hot-toast";

const appointmentApi = axios.create({
  baseURL: "http://127.0.0.1:8002/api/",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Vẫn dùng Token từ Auth để Appointment Service xác thực
appointmentApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Xử lý lỗi riêng cho lịch hẹn
appointmentApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || "Lỗi kết nối đến dịch vụ lịch hẹn!";

    if (error.response?.status === 401) {
      toast.error("Bạn không có quyền truy cập hoặc phiên đã hết hạn!");
    } else if (error.response?.status === 500) {
      toast.error("Lỗi hệ thống Appointment (500) - Báo ngay cho ông Backend!");
    } else {
      toast.error(message);
    }

    return Promise.reject(error);
  },
);

export default appointmentApi;
