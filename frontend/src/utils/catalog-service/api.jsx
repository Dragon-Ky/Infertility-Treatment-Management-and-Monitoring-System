import axios from "axios";
import toast from "react-hot-toast";

const catalogApi = axios.create({
  baseURL: "http://127.0.0.1:8002/api/", // URL Catalog Service
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ĐÍNH KÈM TOKEN: Tự động thêm Token vào mỗi request nếu có
catalogApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Xử lý lỗi toàn cục
catalogApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Tùy chọn: Xử lý logout nếu token hết hạn ở catalog service
    }
    return Promise.reject(error);
  },
);

export default catalogApi;
