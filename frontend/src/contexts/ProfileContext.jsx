import React, { createContext, useContext, useState, useEffect } from "react";
import { updateProfileApi, changePasswordApi } from "@/services/userService";
import { toast } from "react-hot-toast";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [user, setUser] = useState({ name: "", phone: "", email: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      setUser({
        name: savedUser.name || "",
        phone: savedUser.phone || "",
        email: savedUser.email || "",
      });
    }
  }, []);

  const updateProfile = async (updateData) => {
    setLoading(true);
    try {
      const data = await updateProfileApi(updateData);

      const currentUser = JSON.parse(localStorage.getItem("user"));
      const newUserRecord = { ...currentUser, ...data.user };

      setUser(newUserRecord);
      localStorage.setItem("user", JSON.stringify(newUserRecord));

      toast.success("Cập nhật thông tin thành công!");
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || "Không thể cập nhật hồ sơ");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (passwordData) => {
    setLoading(true);
    try {
      await changePasswordApi(passwordData);
      toast.success("Đổi mật khẩu thành công!");
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi đổi mật khẩu");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProfileContext.Provider
      value={{ user, setUser, loading, updateProfile, changePassword }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

// Custom hook để sử dụng Context nhanh hơn
// eslint-disable-next-line react-refresh/only-export-components
export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};
