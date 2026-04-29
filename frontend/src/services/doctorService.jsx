import api from "@/utils/auth-service/api";
import treatmentApi from "@/utils/treatment-service/treatmentApi";

export const getCustomers = async () => {
  const response = await api.get("/doctor/customers");
  return response.data;
};

export const getDoctorDashboard = async () => {
  const response = await api.get("/doctor/dashboard");
  return response.data;
};

export const getTreatmentDashboard = async () => {
  const response = await treatmentApi.get("/dashboard/summary");
  return response.data;
};
