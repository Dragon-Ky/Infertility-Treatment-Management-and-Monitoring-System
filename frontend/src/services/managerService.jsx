import api from "@/utils/auth-service/api";

export const getDoctors = async () => {
  const response = await api.get("/doctors");
  return response.data;
};
