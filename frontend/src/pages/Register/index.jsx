import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerApi } from "../../services/authService";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { TbActivityHeartbeat } from "react-icons/tb";
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineUser,
  HiOutlinePhone,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiCheckCircle,
  HiXCircle,
} from "react-icons/hi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import medicen from "../../assets/Images/logo.webp";
import { requirements } from "@/constant/requirementsPassword.constant";

function Register() {
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    if (data.password !== data.confirmPassword) {
      setError("Mật khẩu xác nhận không trùng khớp!");
      return;
    }

    // Kiểm tra độ mạnh mật khẩu trước khi gửi
    const isStrong = requirements.every((req) => req.re.test(data.password));
    if (!isStrong) {
      setError("Mật khẩu chưa đạt yêu cầu bảo mật!");
      return;
    }

    setLoading(true);
    try {
      const response = await registerApi({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });

      if (response) {
        navigate("/login");
      }
    } catch (err) {
      const backendErrors = err?.response?.data?.errors;
      if (backendErrors) {
        const firstError = Object.values(backendErrors)[0][0];
        setError(firstError);
      } else {
        setError(err?.response?.data?.message || "Đăng ký thất bại!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <div className="relative hidden w-1/2 flex-col items-center justify-center overflow-hidden bg-(--bg-section) lg:flex">
        <div className="absolute top-12 left-12">
          <img src={medicen} alt="Medicen" className="w-40 opacity-90" />
        </div>
        <div className="relative z-10 flex flex-col items-center px-12 text-center">
          <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-[32px] bg-white shadow-2xl shadow-blue-200/50">
            <TbActivityHeartbeat className="h-14 w-14 text-(--primaryCustom)" />
          </div>
          <h2 className="text-5xl leading-tight font-black tracking-tighter text-slate-800">
            Bắt đầu hành trình <br />
            <span className="text-(--primaryCustom)">hạnh phúc</span> của bạn
          </h2>
          <p className="mt-6 max-w-sm text-lg font-medium text-slate-500 italic">
            "Tạo hồ sơ bệnh nhân để được đội ngũ bác sĩ hàng đầu hỗ trợ."
          </p>
        </div>
      </div>

      <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
        <div className="animate-in fade-in slide-in-from-right-8 w-full max-w-110 duration-700">
          <header className="mb-8">
            <h1 className="mb-2 text-4xl font-black tracking-tight text-slate-900">
              Đăng ký hồ sơ
            </h1>
            <p className="font-medium text-slate-500 italic">
              Dành riêng cho bệnh nhân Medicen
            </p>
          </header>

          <form
            onSubmit={handleRegister}
            className="space-y-6"
            autoComplete="off"
          >
            <div className="space-y-2">
              <Label className="ml-1 text-xs font-black tracking-widest text-slate-400 uppercase">
                Họ và Tên
              </Label>
              <div className="group relative">
                <HiOutlineUser className="absolute top-1/2 left-0 -translate-y-1/2 text-2xl text-slate-300 group-focus-within:text-(--primaryCustom)" />
                <Input
                  name="name"
                  required
                  placeholder="Nguyễn Văn A"
                  className="h-12 rounded-none border-0 border-b-2 border-slate-100 bg-transparent px-0 pl-9 text-lg shadow-none focus-visible:border-(--primaryCustom) focus-visible:ring-0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="ml-1 text-xs font-black tracking-widest text-slate-400 uppercase">
                  Email
                </Label>
                <div className="group relative">
                  <HiOutlineMail className="absolute top-1/2 left-0 -translate-y-1/2 text-2xl text-slate-300 group-focus-within:text-(--primaryCustom)" />
                  <Input
                    name="email"
                    type="email"
                    required
                    placeholder="a@gmail.com"
                    className="h-12 rounded-none border-0 border-b-2 border-slate-100 bg-transparent px-0 pl-9 text-lg shadow-none focus-visible:border-(--primaryCustom) focus-visible:ring-0"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="ml-1 text-xs font-black tracking-widest text-slate-400 uppercase">
                  Số điện thoại
                </Label>
                <div className="group relative">
                  <HiOutlinePhone className="absolute top-1/2 left-0 -translate-y-1/2 text-2xl text-slate-300 group-focus-within:text-(--primaryCustom)" />
                  <Input
                    name="phone"
                    type="tel"
                    required
                    placeholder="090..."
                    className="h-12 rounded-none border-0 border-b-2 border-slate-100 bg-transparent px-0 pl-9 text-lg shadow-none focus-visible:border-(--primaryCustom) focus-visible:ring-0"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="ml-1 text-xs font-black tracking-widest text-slate-400 uppercase">
                Mật khẩu
              </Label>
              <div className="group relative">
                <HiOutlineLockClosed className="absolute top-1/2 left-0 -translate-y-1/2 text-2xl text-slate-300 group-focus-within:text-(--primaryCustom)" />
                <Input
                  name="password"
                  type={isVisible ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-12 rounded-none border-0 border-b-2 border-slate-100 bg-transparent px-0 pr-10 pl-9 text-lg shadow-none focus-visible:border-(--primaryCustom) focus-visible:ring-0"
                />
                <button
                  type="button"
                  onClick={() => setIsVisible(!isVisible)}
                  className="absolute top-1/2 right-0 -translate-y-1/2 text-slate-300 hover:text-slate-600"
                >
                  {isVisible ? (
                    <HiOutlineEyeOff size={22} />
                  ) : (
                    <HiOutlineEye size={22} />
                  )}
                </button>
              </div>

              <div
                className={`grid transition-all duration-500 ease-in-out ${
                  password
                    ? "mt-4 grid-rows-[1fr] opacity-100"
                    : "mt-0 grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="grid grid-cols-2 gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                    {requirements.map((req, idx) => {
                      const isDone = req.re.test(password);
                      return (
                        <div
                          key={idx}
                          className={`flex items-center gap-2 text-[11px] font-bold transition-colors duration-300 ${isDone ? "text-green-600" : "text-slate-400"}`}
                        >
                          {isDone ? (
                            <HiCheckCircle className="scale-110 text-sm" />
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

            <div className="space-y-2">
              <Label className="ml-1 text-xs font-black tracking-widest text-slate-400 uppercase">
                Xác nhận mật khẩu
              </Label>
              <div className="group relative">
                <HiOutlineLockClosed className="absolute top-1/2 left-0 -translate-y-1/2 text-2xl text-slate-300 group-focus-within:text-(--primaryCustom)" />
                <Input
                  name="confirmPassword"
                  type={isVisible ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="h-12 rounded-none border-0 border-b-2 border-slate-100 bg-transparent px-0 pl-9 text-lg shadow-none focus-visible:border-(--primaryCustom) focus-visible:ring-0"
                />
              </div>
            </div>

            {error && (
              <div className="animate-in fade-in rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-600">
                {error}
              </div>
            )}

            <Button
              disabled={loading}
              type="submit"
              className="h-16 w-full rounded-2xl bg-(--primaryCustom) text-lg font-black text-white shadow-2xl shadow-blue-100 transition-all hover:bg-(--primaryCustom) hover:shadow-blue-200 active:scale-[0.98] disabled:opacity-70"
            >
              {loading ? (
                <AiOutlineLoading3Quarters className="animate-spin text-xl" />
              ) : (
                "TẠO HỒ SƠ NGAY"
              )}
            </Button>
          </form>

          <div className="mt-10 border-t border-slate-50 pt-8 text-center">
            <p className="font-medium text-slate-500 italic">
              Đã có tài khoản tại Medicen?
              <Link
                to="/login"
                className="ml-2 border-b-2 border-(--primaryCustom) pb-1 font-black text-(--primaryCustom) not-italic transition-all hover:bg-blue-50"
              >
                ĐĂNG NHẬP
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
