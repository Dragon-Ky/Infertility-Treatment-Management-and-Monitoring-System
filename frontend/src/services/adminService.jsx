import api from "@/utils/auth-service/api";

export const getAllManagers = async () => {
  const response = await api.get("/admin/managers");
  return response.data;
};
