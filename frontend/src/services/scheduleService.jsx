import treatmentApi from "@/utils/treatment-service/treatmentApi";

export const getMedicationSchedules = async (protocolId) => {
  const response = await treatmentApi.get("/schedules", {
    params: { protocol_id: protocolId },
  });
  return response.data;
};

export const createMedicationSchedule = async (data) => {
  const response = await treatmentApi.post("/schedules", data);
  return response.data;
};
