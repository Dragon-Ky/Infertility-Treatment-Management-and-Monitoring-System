import treatmentApi from "@/utils/treatment-service/treatmentApi";

export const getMedicationRecords = async (scheduleId = null) => {
  // Nếu có scheduleId thì truyền lên, không thì lấy hết
  const params = scheduleId ? { medication_schedule_id: scheduleId } : {};
  const response = await treatmentApi.get(`/medication-records`, { params });
  return response.data;
};

export const createMedicationRecord = async (data) => {
  const response = await treatmentApi.post(`/medication-records`, data);
  return response.data;
};

export const deleteMedicationRecord = async (id) => {
  const response = await treatmentApi.delete(`/medication-records/${id}`);
  return response.data;
};
