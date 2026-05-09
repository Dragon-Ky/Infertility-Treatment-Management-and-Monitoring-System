import notificationApi from "@/utils/notification-service/notificationApi";

export const sendEmailNotification = async (data) => {
  const response = await notificationApi.post("/notifications/email", data);
  return response.data;
};
