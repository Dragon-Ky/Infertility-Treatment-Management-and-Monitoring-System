import axios from "axios";
import toast from "react-hot-toast";

const reportApi = axios.create({
  baseURL: "http://127.0.0.1:8006/api/",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// QUAN TRỌNG: Vẫn dùng Token từ Auth để Report Service xác thực
reportApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

reportApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || "Lỗi kết nối đến dịch vụ báo cáo!";

    if (error.response?.status === 401) {
      toast.error("Bạn không có quyền truy cập vùng báo cáo!");
    } else if (error.response?.status === 500) {
      toast.error("Lỗi hệ thống Report (500) - Check lại NiFi/Database!");
    } else {
      toast.error(message);
    }

    return Promise.reject(error);
  },
);

export default reportApi;
