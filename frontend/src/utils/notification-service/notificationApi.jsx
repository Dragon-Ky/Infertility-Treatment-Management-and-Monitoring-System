import axios from "axios";

const notificationApi = axios.create({
  baseURL: "http://localhost:8004/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Thêm interceptor để đính kèm token
notificationApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default notificationApi;
