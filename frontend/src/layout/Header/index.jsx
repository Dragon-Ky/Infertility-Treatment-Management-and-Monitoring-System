import { Link, useNavigate } from "react-router-dom";
import medicen from "../../assets/Images/logo.webp";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  User,
} from "@nextui-org/react";
import {
  HiChevronDown,
  HiOutlineLogout,
  HiOutlineUser,
  HiOutlineCalendar,
  HiOutlineCog,
} from "react-icons/hi";

function Header() {
  const menu = ["Giới thiệu", "Dịch vụ", "Bác sĩ", "Blog", "Liên hệ"];

  const navigate = useNavigate();
  const userJson = localStorage.getItem("user");
  const user = userJson ? JSON.parse(userJson) : null;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
    window.location.reload();
  };

  return (
    <>
      <header className="sticky top-0 left-0 z-900 w-full bg-white shadow-[0px_3px_8px_rgba(0,0,0,0.24)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between py-[1vw] text-[1.2vw]">
          {/* Logo */}
          <Link to="/">
            <img src={medicen} alt="Logo" className="w-[12vw] object-cover" />
          </Link>

          <div className="flex items-center gap-[1vw] font-semibold">
            {menu.map((item, index) => (
              <Link
                key={index}
                className="relative z-1 cursor-pointer overflow-hidden rounded-[20px] px-[1vw] py-[0.8vw] after:absolute after:inset-0 after:z-[-1] after:origin-center after:scale-x-0 after:bg-(--primaryCustom) after:transition-transform after:duration-300 after:content-[''] hover:text-white hover:after:scale-x-100"
              >
                {item}
              </Link>
            ))}
          </div>

          {user ? (
            <div>
              <Dropdown
                placement="bottom-end"
                className="rounded-xl border border-slate-100 bg-white shadow-xl"
              >
                <DropdownTrigger>
                  <div className="group flex cursor-pointer items-center gap-2 rounded-full p-1 transition-all hover:bg-slate-50">
                    <User
                      as="button"
                      name={
                        <span className="block text-[1vw] font-bold text-slate-800">
                          {user.name}
                        </span>
                      }
                      description={
                        <span className="block text-[0.7vw] tracking-wider text-slate-500 uppercase">
                          {user.roles?.[0]?.name || "Bệnh nhân"}
                        </span>
                      }
                      avatarProps={{
                        fallback: user.name?.charAt(0).toUpperCase(),
                        className:
                          "bg-(--primaryCustom) text-white font-bold shrink-0",
                        size: "sm",
                      }}
                      className="transition-transform"
                    />
                    <HiChevronDown className="ml-1 text-slate-400 transition-colors group-hover:text-(--primaryCustom)" />
                  </div>
                </DropdownTrigger>

                <DropdownMenu
                  aria-label="User Actions"
                  variant="solid"
                  className="flex flex-col justify-center"
                >
                  <DropdownItem
                    key="profile"
                    className="rounded-lg transition-all data-[hover=true]:bg-(--primaryCustom) data-[hover=true]:text-white"
                  >
                    <span className="flex items-center gap-1 px-[1vw] py-[2vh] font-medium">
                      <span>
                        <HiOutlineUser />
                      </span>
                      <span>Hồ sơ cá nhân</span>
                    </span>
                  </DropdownItem>

                  <DropdownItem
                    key="appointments"
                    className="rounded-lg transition-all data-[hover=true]:bg-(--primaryCustom) data-[hover=true]:text-white"
                  >
                    <span className="flex items-center gap-1 px-[1vw] py-[2vh] font-medium">
                      <span>
                        <HiOutlineCalendar />
                      </span>
                      <span>Hồ sơ cá nhân</span>
                    </span>
                  </DropdownItem>

                  <DropdownItem
                    key="settings"
                    className="rounded-lg transition-all data-[hover=true]:bg-(--primaryCustom) data-[hover=true]:text-white"
                  >
                    <span className="flex items-center gap-1 px-[1vw] py-[2vh] font-medium">
                      <span>
                        <HiOutlineCog />
                      </span>
                      <span>Hồ sơ cá nhân</span>
                    </span>
                  </DropdownItem>

                  <DropdownItem
                    key="logout"
                    color="danger"
                    className="rounded-lg transition-all data-[hover=true]:bg-(--dangerCustom) data-[hover=true]:text-white"
                    onClick={handleLogout}
                  >
                    <span className="flex items-center gap-1 px-[1vw] py-[2vh] font-medium">
                      <span>
                        <HiOutlineLogout />
                      </span>
                      <span> Đăng xuất</span>
                    </span>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          ) : (
            <Link to="/login">
              <button className="inline-flex transform rounded-[20px] border border-white bg-(--primaryCustom) px-[1vw] py-[0.7vw] font-semibold text-white transition-(--hv-transition) duration-300 hover:border-(--primaryCustom) hover:bg-white hover:text-(--primaryCustom)">
                Đăng nhập
              </button>
            </Link>
          )}
        </div>
      </header>
    </>
  );
}

export default Header;
