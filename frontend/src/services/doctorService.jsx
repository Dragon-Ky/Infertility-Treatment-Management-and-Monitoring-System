import api from "../utils/api";

export const getDoctors = async () => {
  const response = await api.get("doctors");
  return response.data;
};

export const getPatientsForDoctor = async () => {
  const response = await api.get("/doctor/customers");
  return response.data;
};
