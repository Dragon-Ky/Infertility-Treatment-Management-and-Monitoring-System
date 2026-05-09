import appointmentApi from "@/utils/appointment-service/appointmentApi";

export const getAllAppointments = async (params = {}) => {
  const response = await appointmentApi.get("/appointments", { params });
  return response.data;
};

export const createAppointment = async (data) => {
  const response = await appointmentApi.post("/appointments", data);
  return response.data;
};

export const cancelAppointment = async (id) => {
  const response = await appointmentApi.post(`/appointments/${id}/cancel`);
  return response.data;
};

export const completeAppointment = async (id) => {
  const response = await appointmentApi.post(`/appointments/${id}/complete`);
  return response.data;
};

export const confirmAppointment = async (id) => {
  const response = await appointmentApi.post(`/appointments/${id}/confirm`);
  return response.data;
};

export const getTreatmentReminders = async (treatmentId) => {
  const response = await appointmentApi.get(
    `/treatments/${treatmentId}/reminders`,
  );
  return response.data;
};

export const deleteAppointment = async (id) => {
  const response = await appointmentApi.delete(`/appointments/${id}`);
  return response.data;
};
