import catalogApi from "@/utils/catalog-service/api";

// SERVICES
export const getAllServices = async () => {
  const response = await catalogApi.get("/services");
  return response.data;
};

export const getServiceDetail = async (id) => {
  const response = await catalogApi.get(`/services/${id}`);
  return response.data;
};

export const createService = async (data) => {
  const response = await catalogApi.post("/services", data);
  return response.data;
};

export const updateService = async (id, data) => {
  const response = await catalogApi.put(`/services/${id}`, data);
  return response.data;
};

export const deleteService = async (id) => {
  const response = await catalogApi.delete(`/services/${id}`);
  return response.data;
};

// SERVICE CATEGORIES
export const getAllServiceCategories = async () => {
  const response = await catalogApi.get("/service-categories");
  return response.data;
};

// DOCTORS
export const getAllDoctors = async () => {
  const response = await catalogApi.get("/doctors");
  return response.data;
};

export const getDoctorDetail = async (id) => {
  const response = await catalogApi.get(`/doctors/${id}`);
  return response.data;
};

export const createDoctor = async (data) => {
  const response = await catalogApi.post("/doctors", data);
  return response.data;
};

export const updateDoctor = async (id, data) => {
  const response = await catalogApi.put(`/doctors/${id}`, data);
  return response.data;
};

export const deleteDoctor = async (id) => {
  const response = await catalogApi.delete(`/doctors/${id}`);
  return response.data;
};

// RATINGS
export const getDoctorRatings = async (doctorId) => {
  const response = await catalogApi.get(`/doctors/${doctorId}/ratings`);
  return response.data;
};

export const createRating = async (data) => {
  const response = await catalogApi.post("/ratings", data);
  return response.data;
};

export const getUserRatings = async (userId) => {
  const response = await catalogApi.get(`/users/${userId}/ratings`);
  return response.data;
};

