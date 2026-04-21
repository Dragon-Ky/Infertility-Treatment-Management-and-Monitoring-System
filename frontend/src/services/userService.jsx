import api from "@/utils/auth-service/api";

export const updateProfileApi = async (data) => {
  const response = await api.post("/update-profile", data);
  return response.data;
};

export const changePasswordApi = async (data) => {
  const response = await api.post("/change-password", data);
  return response.data;
};
