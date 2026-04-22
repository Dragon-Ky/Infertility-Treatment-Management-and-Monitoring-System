import api from "@/utils/auth-service/api";

export const getPatientsForDoctor = async () => {
  const response = await api.get("/doctor/customers");
  return response.data;
};
