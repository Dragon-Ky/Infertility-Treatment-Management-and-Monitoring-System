import api from "../../utils/auth-service/api";

export const getDoctors = async () => {
  const response = await api.get("/manager/doctors");
  return response.data;
};
