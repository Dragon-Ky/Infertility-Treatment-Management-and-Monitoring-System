import treatmentApi from "@/utils/treatment-service/treatmentApi";

export const getStorageByProtocol = async (protocolId) => {
  const response = await treatmentApi.get(`/storage`, {
    params: { treatment_id: protocolId },
  });
  return response.data;
};

export const createStorageRecord = async (data) => {
  const response = await treatmentApi.post(`/storage`, data);
  return response.data;
};

export const updateStorageRecord = async (id, data) => {
  const response = await treatmentApi.patch(`/storage/${id}`, data);
  return response.data;
};

export const deleteStorageRecord = async (id) => {
  const response = await treatmentApi.delete(`/storage/${id}`);
  return response.data;
};
