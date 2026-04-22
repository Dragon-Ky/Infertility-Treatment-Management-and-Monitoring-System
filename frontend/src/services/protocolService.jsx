import treatmentApi from "@/utils/treatment-service/treatmentApi";

export const getAllProtocols = async (params) => {
  const response = await treatmentApi.get("/protocols", { params });
  return response.data;
};

export const getProtocolDetail = async (id) => {
  const response = await treatmentApi.get(`/protocols/${id}`);
  return response.data;
};

export const createProtocol = async (data) => {
  const response = await treatmentApi.post("/protocols", data);
  return response.data;
};

export const updateProtocol = async (id, data) => {
  const response = await treatmentApi.put(`/protocols/${id}`, data);
  return response.data;
};

export const deleteProtocol = async (id) => {
  const response = await treatmentApi.delete(`/protocols/${id}`);
  return response.data;
};
