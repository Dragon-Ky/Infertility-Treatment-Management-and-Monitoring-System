import PrivateRoutes from "../components/PrivateRoutes";
import LayoutDefault from "../layout/LayoutDefault";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Patient/Profile";
import AdminDashboard from "../pages/Admin/Dashboard";
import DoctorDashboard from "../pages/Doctor/Dashboard";

export const routes = [
  //Public routes
  {
    path: "/",
    element: <LayoutDefault />,
    children: [
      {
        path: "/",
        element: <Home />,
      },

      {
        path: "/403",
        element: <div>Bạn không có quyền truy cập trang này!</div>,
      },
    ],
  },

  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "/register",
    element: <Register />,
  },

  // Protect Admin
  {
    element: <PrivateRoutes allowRoles={["Admin"]} />,
    children: [
      {
        path: "/admin",
        element: <LayoutDefault />,
        children: [{ path: "dashboard", element: <AdminDashboard /> }],
      },
    ],
  },

  // Protect Doctor
  {
    element: <PrivateRoutes allowRoles={["Doctor"]} />,
    children: [
      {
        path: "/doctor",
        element: <LayoutDefault />,
        children: [{ path: "dashboard", element: <DoctorDashboard /> }],
      },
    ],
  },

  // Protect Patient
  {
    element: <PrivateRoutes allowRoles={["Patient"]} />,
    children: [
      {
        path: "/patient",
        element: <LayoutDefault />,
        children: [
          { path: "my-treatment", element: <div>Trang lộ trình điều trị</div> },
        ],
      },
    ],
  },

  {
    element: <PrivateRoutes allowRoles={["Admin", "Doctor", "Patient"]} />,
    children: [
      {
        path: "/profile",
        element: <LayoutDefault />,
        children: [{ path: "", element: <Profile /> }],
      },
    ],
  },
];
