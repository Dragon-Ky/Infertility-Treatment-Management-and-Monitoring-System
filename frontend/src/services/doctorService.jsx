import api from "@/utils/auth-service/api";

export const getCustomers = async () => {
  const response = await api.get("/doctor/customers");
  return response.data;
};

export const getDoctorDashboard = async () => {
  const response = await api.get("/doctor/dashboard");
  return response.data;
};
