import treatmentApi from "@/utils/treatment-service/treatmentApi";

export const getSpecimensByProtocol = async (protocolId) => {
  const response = await treatmentApi.get(`/specimens`, {
    params: { protocol_id: protocolId },
  });
  return response.data;
};

export const createSpecimen = async (data) => {
  const response = await treatmentApi.post(`/specimens`, data);
  return response.data;
};

export const updateSpecimen = async (id, data) => {
  const response = await treatmentApi.patch(`/specimens/${id}`, data);
  return response.data;
};

export const deleteSpecimen = async (id) => {
  const response = await treatmentApi.delete(`/specimens/${id}`);
  return response.data;
};
