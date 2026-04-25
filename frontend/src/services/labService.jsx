import treatmentApi from "@/utils/treatment-service/treatmentApi";

export const getLabResults = async (protocolId) => {
  const response = await treatmentApi.get("/lab-results", {
    params: { protocol_id: protocolId }
  });
  return response.data;
};

export const createLabResult = async (data) => {
  const response = await treatmentApi.post("/lab-results", data);
  return response.data;
};

export const deleteLabResult = async (id) => {
  const response = await treatmentApi.delete(`/lab-results/${id}`);
  return response.data;
};