import axios from "axios";
import toast from "react-hot-toast";

const treatmentApi = axios.create({
  baseURL: "http://127.0.0.1:8001/api/v1/treatment/",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// QUAN TRỌNG: Vẫn dùng Token từ Auth để Treatment Service xác thực (vì 2 bên chung JWT_SECRET)
treatmentApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

treatmentApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || "Lỗi kết nối đến dịch vụ điều trị!";

    if (error.response?.status === 401) {
      toast.error("Bạn không có quyền truy cập vùng này!");
    } else if (error.response?.status === 500) {
      toast.error("Lỗi hệ thống Treatment (500) - Check lại database!");
    } else {
      toast.error(message);
    }

    return Promise.reject(error);
  },
);

export default treatmentApi;
