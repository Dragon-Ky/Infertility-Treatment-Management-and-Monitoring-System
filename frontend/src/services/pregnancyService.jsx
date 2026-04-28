import treatmentApi from "@/utils/treatment-service/treatmentApi";

export const getPregnancyTrackings = async (protocolId) => {
  const response = await treatmentApi.get(`/pregnancy-trackings`, {
    params: { treatment_id: protocolId },
  });
  return response.data;
};

export const createPregnancyTracking = async (data) => {
  const response = await treatmentApi.post(`/pregnancy-trackings`, data);
  return response.data;
};

export const updatePregnancyTracking = async (id, data) => {
  const response = await treatmentApi.patch(`/pregnancy-trackings/${id}`, data);
  return response.data;
};

export const deletePregnancyTracking = async (id) => {
  const response = await treatmentApi.delete(`/pregnancy-trackings/${id}`);
  return response.data;
};
