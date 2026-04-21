import api from "../utils/auth-service/api";

export const getPatientsForDoctor = async () => {
  const response = await api.get("/admin/managers");
  return response.data;
};
