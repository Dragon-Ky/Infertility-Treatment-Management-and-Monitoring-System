import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginApi } from "../../services/authService";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

import { TbActivityHeartbeat } from "react-icons/tb";
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
} from "react-icons/hi";

import { AiOutlineLoading3Quarters } from "react-icons/ai";
import medicen from "../../assets/Images/logo.webp";

function Login() {
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const dataForm = Object.fromEntries(formData);

    try {
      const data = await loginApi(dataForm.email, dataForm.password);

      if (data && data.access_token) {
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Lấy Role đầu tiên từ mảng roles
        const userRole = data.user.roles?.[0]?.name;

        if (userRole === "Admin") {
          navigate("/admin/dashboard");
        } else if (userRole === "Manager") {
          navigate("/manager/dashboard");
        } else if (userRole === "Doctor") {
          navigate("/doctor/dashboard");
        } else {
          navigate("/");
        }

        window.location.reload();
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Email hoặc mật khẩu không chính xác!");
      } else if (err.response?.status === 422) {
        setError("Dữ liệu nhập vào không hợp lệ!");
      } else {
        setError("Hệ thống đang bảo trì. Thử lại sau!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <div className="relative hidden w-1/2 flex-col items-center justify-center overflow-hidden bg-(--bg-section) lg:flex">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-blue-200/20 blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-blue-300/10 blur-[100px]" />

        <div className="relative z-10 flex flex-col items-center px-12 text-center">
          <img src={medicen} alt="Medicen" className="mb-12 w-48 opacity-90" />
          <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-[32px] bg-white shadow-2xl shadow-blue-200/50 transition-transform duration-500 hover:scale-105">
            <TbActivityHeartbeat className="h-14 w-14 animate-pulse text-(--primaryCustom)" />
          </div>
          <h2 className="text-5xl leading-tight font-black tracking-tighter text-slate-800">
            Đồng hành cùng <br />
            <span className="text-(--primaryCustom)">ước mơ</span> làm mẹ
          </h2>
          <p className="mt-6 max-w-sm text-lg leading-relaxed font-medium text-slate-500 italic">
            "Hệ thống quản lý y tế chuyên biệt cho hành trình tìm kiếm thiên
            thần nhỏ."
          </p>
        </div>
        <div className="absolute bottom-8 text-xs font-bold tracking-widest text-slate-400 uppercase">
          © 2026 Medicen Clinic • International Standard
        </div>
      </div>

      <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
        <div className="animate-in fade-in slide-in-from-right-8 w-full max-w-105 duration-700">
          <div className="mb-12">
            <h1 className="mb-3 text-4xl font-black tracking-tight text-slate-900">
              Đăng nhập
            </h1>
            <p className="font-medium text-slate-500">
              Vui lòng nhập thông tin để truy cập hệ thống
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-3">
              <Label
                htmlFor="email"
                className="ml-1 text-xs font-black tracking-[0.2em] text-slate-400 uppercase"
              >
                Địa chỉ Email
              </Label>
              <div className="group relative">
                <div className="absolute top-1/2 left-0 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-(--primaryCustom)">
                  <HiOutlineMail size={24} />
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@medicen.vn"
                  required
                  className="h-14 rounded-none border-0 border-b-2 border-slate-100 bg-transparent px-0 pl-10 text-lg shadow-none transition-all focus-visible:border-(--primaryCustom) focus-visible:ring-0"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="password"
                className="ml-1 text-xs font-black tracking-[0.2em] text-slate-400 uppercase"
              >
                Mật khẩu
              </Label>
              <div className="group relative">
                <div className="absolute top-1/2 left-0 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-(--primaryCustom)">
                  <HiOutlineLockClosed size={24} />
                </div>
                <Input
                  id="password"
                  name="password"
                  type={isVisible ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  className="h-14 rounded-none border-0 border-b-2 border-slate-100 bg-transparent px-0 pr-10 pl-10 text-lg shadow-none transition-all focus-visible:border-(--primaryCustom) focus-visible:ring-0"
                />
                <button
                  type="button"
                  onClick={() => setIsVisible(!isVisible)}
                  className="absolute top-1/2 right-0 -translate-y-1/2 text-slate-300 transition-colors hover:text-slate-600 focus:outline-none"
                >
                  {isVisible ? (
                    <HiOutlineEyeOff size={22} />
                  ) : (
                    <HiOutlineEye size={22} />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between px-1 pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  className="h-5 w-5 rounded-md border-slate-200 data-[state=checked]:border-(--primaryCustom) data-[state=checked]:bg-(--primaryCustom)"
                />
                <Label
                  htmlFor="remember"
                  className="cursor-pointer text-sm font-bold text-slate-500"
                >
                  Ghi nhớ tôi
                </Label>
              </div>
              <Link
                to="#"
                className="text-sm font-black text-(--primaryCustom) transition-opacity hover:opacity-70"
              >
                Quên mật khẩu?
              </Link>
            </div>

            <div className="flex min-h-15 items-center transition-all duration-300">
              {error && (
                <div className="animate-in fade-in zoom-in w-full rounded-xl border border-red-100 bg-red-50 p-3 text-sm font-bold text-red-600 duration-300">
                  {error}
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="h-16 w-full rounded-2xl bg-(--primaryCustom) text-lg font-black text-white shadow-2xl shadow-blue-100 transition-all hover:bg-(--primaryCustom) hover:shadow-blue-200 active:scale-[0.98]"
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <AiOutlineLoading3Quarters className="animate-spin text-xl" />
                  <span className="tracking-widest">ĐANG XÁC THỰC...</span>
                </div>
              ) : (
                "ĐĂNG NHẬP"
              )}
            </Button>
          </form>

          <div className="mt-12 border-t border-slate-50 pt-10 text-center">
            <p className="font-medium text-slate-500 italic">
              Bạn chưa có hồ sơ bệnh nhân?
              <Link
                to="/register"
                className="ml-2 border-b-2 border-(--primaryCustom) pb-1 font-black text-(--primaryCustom) not-italic transition-all hover:bg-blue-50"
              >
                ĐĂNG KÝ NGAY
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
