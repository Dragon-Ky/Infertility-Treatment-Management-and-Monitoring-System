import reportApi from "@/utils/report-service/reportApi";

export const getDashboardData = async () => {
  const response = await reportApi.get(`/dashboard`);
  return response.data;
};

export const getSystemOverview = async () => {
  const response = await reportApi.get(`/dashboard/overview`);
  return response.data;
};

export const generateReport = async (data) => {
  const response = await reportApi.post(`/reports/generate`, data);
  return response.data;
};

// Hàm này không gọi Axios mà chỉ trả về URL để user click tải file
export const getDownloadReportUrl = (id) => {
  return `http://127.0.0.1:8006/api/reports/${id}/download`;
};

// Lấy trạng thái và lịch sử đồng bộ
export const getSyncStatus = async () => {
  const response = await reportApi.get(`/admin/sync-status`);
  return response.data;
};

// Kích hoạt đồng bộ (Truyền vào source_service và sync_type)
export const triggerSyncData = async (
  sourceService,
  syncType = "full_sync",
) => {
  const response = await reportApi.post(`/admin/sync/trigger`, {
    source_service: sourceService,
    sync_type: syncType,
  });
  return response.data;
};
