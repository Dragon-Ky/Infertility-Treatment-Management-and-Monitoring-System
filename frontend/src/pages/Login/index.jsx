import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../../services/authService";
import { CiLock } from "react-icons/ci";
import { TbBrandGmail, TbActivityHeartbeat } from "react-icons/tb";
import { MdCrisisAlert } from "react-icons/md";
import { RiLoader2Line } from "react-icons/ri";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Gọi API login
      const data = await loginApi(email, password);

      // console.log(data);

      // 2. LƯU VÀO LOCAL STORAGE
      if (data.access_token) {
        localStorage.setItem("access_token", data.access_token);
        // Lưu object user dưới dạng string
        localStorage.setItem("user", JSON.stringify(data.user));

        // 3. Lấy role để điều hướng
        const userRole = data.user.roles?.[0]?.name;

        if (userRole === "Admin") {
          navigate("/admin/dashboard");
        } else if (userRole === "Doctor") {
          navigate("/doctor/dashboard");
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Email hoặc mật khẩu không chính xác!",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 shadow-inner">
            <TbActivityHeartbeat className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">
            Clinic Management
          </h1>
          <p className="mt-2 text-sm tracking-wider text-slate-500 uppercase">
            Hệ thống Quản lý Hiếm muộn
          </p>
        </div>

        {error && (
          <div className="mb-6 flex animate-pulse items-center border-l-4 border-red-500 bg-red-50 p-4 text-red-700">
            <MdCrisisAlert className="mr-2 h-5 w-5" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Email Tài khoản
            </label>
            <div className="group relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <TbBrandGmail className="h-5 w-5 text-slate-400 transition-colors group-focus-within:text-blue-500" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-3 pl-10 transition-all outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500"
                placeholder="doctor@gmail.com"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Mật khẩu
            </label>
            <div className="group relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <CiLock className="h-5 w-5 text-slate-400 transition-colors group-focus-within:text-blue-500" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-3 pl-10 transition-all outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-xl bg-blue-600 py-3 font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 active:scale-95 disabled:bg-blue-300"
          >
            {loading ? (
              <>
                <RiLoader2Line className="mr-2 h-5 w-5 animate-spin" />
                Đang xác thực...
              </>
            ) : (
              "Đăng nhập ngay"
            )}
          </button>
        </form>

        <div className="mt-8 border-t border-slate-100 pt-6 text-center">
          <p className="text-sm text-slate-400 italic">
            Dành riêng cho Bác sĩ và Nhân viên y tế
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
