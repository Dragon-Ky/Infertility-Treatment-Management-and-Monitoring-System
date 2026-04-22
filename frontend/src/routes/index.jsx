import PrivateRoutes from "@/components/PrivateRoutes";
import LayoutDefault from "@/layout/LayoutDefault";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Error403 from "@/pages/Error403";
import Profile from "@/pages/Profile";
import BlogDetail from "@/pages/BlogDetail";
import AdminDashboard from "@/pages/Admin/Dashboard";
import DoctorDashboard from "@/pages/Doctor/Dashboard";
import ManagerDashboard from "@/pages/Manager/Dashboard";
import Error404 from "@/pages/Error404";
import BlogList from "@/pages/BlogList";
import ProtocolManagement from "@/pages/Doctor/ProtocolManagement";
import ProtocolDetail from "@/pages/Doctor/ProtocolDetail";

export const routes = [
  // --- PUBLIC ROUTES ---
  {
    path: "/",
    element: <LayoutDefault />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/blog", element: <BlogList /> },
      { path: "/blog/:id", element: <BlogDetail /> },
      { path: "/403", element: <Error403 /> },
    ],
  },

  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },

  // --- PRIVATE ROUTES ---

  // 1. DÀNH CHO ADMIN (Tối cao - Quản lý Manager)
  {
    element: <PrivateRoutes allowRoles={["Admin"]} />,
    children: [
      {
        path: "/admin",
        element: <LayoutDefault />,
        children: [
          { path: "dashboard", element: <AdminDashboard /> },
          {
            path: "manage-managers",
            element: <div>Trang Admin quản lý Manager</div>,
          },
        ],
      },
    ],
  },

  // 2. DÀNH CHO MANAGER (Quản lý Doctor và Customer)
  // Admin cũng có quyền vào Manager
  {
    element: <PrivateRoutes allowRoles={["Admin", "Manager"]} />,
    children: [
      {
        path: "/manager",
        element: <LayoutDefault />,
        children: [
          {
            path: "dashboard",
            element: <ManagerDashboard />,
          },
          {
            path: "manage-doctors",
            element: <div>Trang Manager quản lý Doctor</div>,
          },
        ],
      },
    ],
  },

  // 3. DÀNH CHO BÁC SĨ (Chăm sóc Customer)
  // Admin và Manager có quyền vào giám sát
  {
    element: <PrivateRoutes allowRoles={["Admin", "Manager", "Doctor"]} />,
    children: [
      {
        path: "/doctor",
        element: <LayoutDefault />,
        children: [
          { path: "dashboard", element: <DoctorDashboard /> },
          { path: "protocols", element: <ProtocolManagement /> },
          { path: "protocols/details/:id", element: <ProtocolDetail /> },
        ],
      },
    ],
  },

  // 4. DÀNH CHO KHÁCH HÀNG (Customer)
  {
    element: <PrivateRoutes allowRoles={["Customer"]} />,
    children: [
      {
        path: "/customer",
        element: <LayoutDefault />,
        children: [
          { path: "my-treatment", element: <div>Trang lộ trình điều trị</div> },
        ],
      },
    ],
  },

  // 5. TRANG CHUNG (Profile)
  {
    element: (
      <PrivateRoutes allowRoles={["Admin", "Manager", "Doctor", "Customer"]} />
    ),
    children: [
      {
        path: "/profile",
        element: <LayoutDefault />,
        children: [{ path: "", element: <Profile /> }],
      },
    ],
  },

  // 404
  {
    path: "*",
    element: <Error404 />,
  },
];
