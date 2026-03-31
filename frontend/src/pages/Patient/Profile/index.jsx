import React, { useState, useEffect } from "react";
import api from "@/utils/api";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaLock,
  FaSave,
  FaKey,
} from "react-icons/fa";
import { toast } from "react-hot-toast";

const PatientProfile = () => {
  const [user, setUser] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const [passwords, setPasswords] = useState({
    old_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

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

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/update-profile", {
        name: user.name,
        phone: user.phone,
      });

      // Cập nhật lại LocalStorage để hiển thị tên mới trên Navbar/Sidebar
      const currentUser = JSON.parse(localStorage.getItem("user"));
      const newUserRecord = { ...currentUser, ...response.data.user };
      localStorage.setItem("user", JSON.stringify(newUserRecord));

      toast.success("Cập nhật thông tin thành công!");
    } catch (error) {
      const msg = error.response?.data?.message || "Không thể cập nhật hồ sơ";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/change-password", passwords);

      // Reset form mật khẩu sau khi thành công
      setPasswords({
        old_password: "",
        new_password: "",
        new_password_confirmation: "",
      });

      toast.success("Đổi mật khẩu thành công!");
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        "Mật khẩu cũ không đúng hoặc dữ liệu sai";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-5xl p-4 md:p-10">
      <h1 className="mb-8 flex items-center gap-3 text-3xl font-bold text-gray-800">
        <FaUser className="text-blue-600" /> Hồ sơ cá nhân
      </h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-2">
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-700">
              <FaUser /> Thông tin cơ bản
            </h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-500">
                  Email (Định danh)
                </label>
                <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-400">
                  <FaEnvelope className="mr-2" />
                  <input
                    type="text"
                    value={user.email}
                    disabled
                    className="w-full cursor-not-allowed bg-transparent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Họ và Tên
                </label>
                <div className="flex items-center rounded-lg border border-gray-300 px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                  <FaUser className="mr-2 text-gray-400" />
                  <input
                    type="text"
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                    className="w-full bg-transparent outline-none"
                    placeholder="Nhập họ tên"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Số điện thoại
                </label>
                <div className="flex items-center rounded-lg border border-gray-300 px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                  <FaPhone className="mr-2 text-gray-400" />
                  <input
                    type="text"
                    value={user.phone}
                    onChange={(e) =>
                      setUser({ ...user, phone: e.target.value })
                    }
                    className="w-full bg-transparent outline-none"
                    placeholder="Nhập số điện thoại"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2 font-bold text-white transition-all hover:bg-blue-700"
            >
              <FaSave /> {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </form>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <form onSubmit={handleChangePassword} className="space-y-4">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-700">
              <FaLock /> Bảo mật
            </h2>

            <div>
              <input
                type="password"
                placeholder="Mật khẩu cũ"
                value={passwords.old_password}
                onChange={(e) =>
                  setPasswords({ ...passwords, old_password: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Mật khẩu mới"
                value={passwords.new_password}
                onChange={(e) =>
                  setPasswords({ ...passwords, new_password: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Xác nhận mật khẩu"
                value={passwords.new_password_confirmation}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    new_password_confirmation: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-800 px-4 py-2 font-bold text-white transition-all hover:bg-black"
            >
              <FaKey /> {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
