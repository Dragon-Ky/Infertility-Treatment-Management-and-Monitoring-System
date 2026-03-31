import { Link, useNavigate } from "react-router-dom";
import medicen from "../../assets/Images/logo.webp";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  HiChevronDown,
  HiOutlineLogout,
  HiOutlineUser,
  HiOutlineCalendar,
  HiOutlineCog,
} from "react-icons/hi";

import { menuHeader } from "@/constant/menuHeader.constant";

function Header() {
  const navigate = useNavigate();

  const userJson = localStorage.getItem("user");
  const user = userJson ? JSON.parse(userJson) : null;
  const userRole = user?.roles?.[0]?.name;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
    window.location.reload();
  };

  return (
    <header className="sticky top-0 left-0 z-900 w-full bg-white/80 shadow-[0px_3px_8px_rgba(0,0,0,0.12)] backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-[1vw] text-[1.1vw]">
        <Link
          to={`${userRole === "Doctor" ? "/doctor/dashboard" : "/"}`}
          className="shrink-0 transition-transform hover:scale-105 active:scale-95"
        >
          <img src={medicen} alt="Logo" className="w-[12vw] object-cover" />
        </Link>

        <div className="flex items-center gap-[0.5vw] font-semibold text-slate-700">
          {menuHeader.map((item) => (
            <Link
              to={`/${item.path}`}
              key={item.id}
              className="relative z-1 cursor-pointer overflow-hidden rounded-[20px] px-[1.2vw] py-[0.8vw] transition-colors duration-300 after:absolute after:inset-0 after:z-[-1] after:origin-center after:scale-x-0 after:bg-(--primaryCustom) after:transition-transform after:duration-300 after:content-[''] hover:text-white hover:after:scale-x-100"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="flex shrink-0 items-center">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="group flex cursor-pointer items-center gap-3 rounded-full border border-slate-100 bg-white p-1 pr-4 transition-all hover:bg-slate-50 hover:shadow-md focus:outline-none active:scale-95">
                  <div className="flex h-[2.8vw] w-[2.8vw] items-center justify-center rounded-full bg-linear-to-tr from-(--primaryCustom) to-blue-400 font-bold text-white shadow-lg shadow-blue-100">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>

                  <div className="text-left leading-tight">
                    <span className="block text-[0.9vw] font-bold tracking-tight text-slate-800 uppercase">
                      {user.name}
                    </span>
                    <span className="block text-[0.7vw] font-medium tracking-wider text-slate-400">
                      {user.roles?.[0]?.name || "Bệnh nhân"}
                    </span>
                  </div>
                  <HiChevronDown className="ml-1 text-slate-400 transition-transform duration-300 group-hover:text-(--primaryCustom) group-data-[state=open]:rotate-180" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="animate-in fade-in zoom-in-95 z-999 w-64 rounded-2xl border-slate-100 bg-white p-2 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] duration-200"
              >
                <DropdownMenuLabel className="px-3 py-2 text-[0.8vw] font-bold tracking-widest text-slate-400 uppercase">
                  Tài khoản
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="bg-slate-100" />

                <DropdownMenuItem className="group flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 transition-all focus:bg-(--primaryCustom)">
                  <HiOutlineUser className="text-xl opacity-70 group-focus:opacity-100" />
                  <Link to="/profile">
                    <span className="text-[0.9vw] font-semibold">
                      Hồ sơ cá nhân
                    </span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem className="group flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 transition-all focus:bg-(--primaryCustom)">
                  <HiOutlineCalendar className="text-xl opacity-70 group-focus:opacity-100" />
                  <span className="text-[0.9vw] font-semibold">
                    Lịch hẹn của tôi
                  </span>
                </DropdownMenuItem>

                <DropdownMenuItem className="group flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 transition-all focus:bg-(--primaryCustom)">
                  <HiOutlineCog className="text-xl opacity-70 group-focus:opacity-100" />
                  <span className="text-[0.9vw] font-semibold">
                    Cài đặt hệ thống
                  </span>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-slate-50" />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="group flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-red-500 transition-all focus:bg-red-500"
                >
                  <HiOutlineLogout className="text-xl opacity-70 group-focus:opacity-100" />
                  <span className="text-[0.9vw] font-bold tracking-tight">
                    Đăng xuất
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login">
              <button className="rounded-full border-2 border-(--primaryCustom) bg-(--primaryCustom) px-[1.8vw] py-[0.7vw] font-bold text-white shadow-lg shadow-blue-100 transition-all duration-300 hover:bg-white hover:text-(--primaryCustom) active:scale-95">
                Đăng nhập
              </button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
