import treatmentApi from "@/utils/treatment-service/treatmentApi";

export const getEventsByProtocol = async (protocolId) => {
  const response = await treatmentApi.get(`/events`, {
    params: { protocol_id: protocolId },
  });
  return response.data;
};

export const createEvent = async (data) => {
  const response = await treatmentApi.post(`/events`, data);
  return response.data;
};

export const updateEvent = async (id, data) => {
  const response = await treatmentApi.patch(`/events/${id}`, data);
  return response.data;
};

export const deleteEvent = async (id) => {
  const response = await treatmentApi.delete(`/events/${id}`);
  return response.data;
};
