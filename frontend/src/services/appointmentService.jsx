import appointmentApi from "@/utils/appointment-service/appointmentApi";

export const getAllAppointments = async () => {
  const response = await appointmentApi.get("/appointments");
  return response.data;
};

export const createAppointment = async (data) => {
  const response = await appointmentApi.post("/appointments", data);
  return response.data;
};

export const updateAppointment = async (id, data) => {
  const response = await appointmentApi.put(`/appointments/${id}`, data);
  return response.data;
};

export const deleteAppointment = async (id) => {
  const response = await appointmentApi.delete(`/appointments/${id}`);
  return response.data;
};
