import React, { useState, useEffect } from "react";
import { useProfile } from "@/contexts/ProfileContext";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaLock,
  FaSave,
  FaKey,
} from "react-icons/fa";
import { HiCheckCircle, HiXCircle } from "react-icons/hi";
import { requirements } from "@/constant/requirementsPassword.constant";

function Profile() {
  const { user, loading, updateProfile, changePassword } = useProfile();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const [passwords, setPasswords] = useState({
    old_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  useEffect(() => {
    if (user && user.email) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    await updateProfile({
      name: formData.name,
      phone: formData.phone,
    });
  };

  const handlePassword = async (e) => {
    e.preventDefault();

    const isStrong = requirements.every((req) =>
      req.re.test(passwords.new_password),
    );
    if (!isStrong) {
      return;
    }

    const result = await changePassword(passwords);
    if (result && result.success) {
      setPasswords({
        old_password: "",
        new_password: "",
        new_password_confirmation: "",
      });
    }
  };

  return (
    <div className="animate-in fade-in container mx-auto max-w-5xl p-4 duration-500 md:p-10">
      <h1 className="mb-8 flex items-center gap-3 text-3xl font-bold text-gray-800">
        <FaUser className="text-blue-600" /> Hồ sơ cá nhân
      </h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* FORM THÔNG TIN CƠ BẢN */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-2">
          <form onSubmit={handleUpdate} className="space-y-6">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-700">
              <FaUser /> Thông tin cơ bản
            </h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium tracking-wider text-gray-500 uppercase">
                  Email (Định danh)
                </label>
                <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-400">
                  <FaEnvelope className="mr-2" />
                  <input
                    type="text"
                    value={formData.email}
                    disabled
                    className="w-full cursor-not-allowed bg-transparent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium tracking-wider text-gray-700 uppercase">
                  Họ và Tên
                </label>
                <div className="flex items-center rounded-lg border border-gray-300 px-3 py-2 transition-all focus-within:ring-2 focus-within:ring-blue-500">
                  <FaUser className="mr-2 text-gray-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full bg-transparent outline-none"
                    placeholder="Nhập họ tên"
                    required
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium tracking-wider text-gray-700 uppercase">
                  Số điện thoại
                </label>
                <div className="flex items-center rounded-lg border border-gray-300 px-3 py-2 transition-all focus-within:ring-2 focus-within:ring-blue-500">
                  <FaPhone className="mr-2 text-gray-400" />
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
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
              className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2 font-bold text-white transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50"
            >
              <FaSave /> {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </form>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <form onSubmit={handlePassword} className="space-y-4">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-700">
              <FaLock /> Bảo mật
            </h2>

            <input
              type="password"
              placeholder="Mật khẩu cũ"
              value={passwords.old_password}
              onChange={(e) =>
                setPasswords({ ...passwords, old_password: e.target.value })
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 transition-all outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <div className="space-y-2">
              <input
                type="password"
                placeholder="Mật khẩu mới"
                value={passwords.new_password}
                onChange={(e) =>
                  setPasswords({ ...passwords, new_password: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 transition-all outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              <div
                className={`grid transition-all duration-500 ease-in-out ${
                  passwords.new_password
                    ? "mt-2 grid-rows-[1fr] opacity-100"
                    : "mt-0 grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="grid grid-cols-1 gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3">
                    {requirements.map((req, idx) => {
                      const isDone = req.re.test(passwords.new_password);
                      return (
                        <div
                          key={idx}
                          className={`flex items-center gap-2 text-[11px] font-bold transition-colors duration-300 ${
                            isDone ? "text-green-600" : "text-slate-400"
                          }`}
                        >
                          {isDone ? (
                            <HiCheckCircle className="text-sm" />
                          ) : (
                            <HiXCircle className="text-sm opacity-40" />
                          )}
                          <span>{req.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <input
              type="password"
              placeholder="Xác nhận mật khẩu mới"
              value={passwords.new_password_confirmation}
              onChange={(e) =>
                setPasswords({
                  ...passwords,
                  new_password_confirmation: e.target.value,
                })
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 transition-all outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-800 px-4 py-2 font-bold text-white transition-all hover:bg-black active:scale-95 disabled:opacity-50"
            >
              <FaKey /> {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
