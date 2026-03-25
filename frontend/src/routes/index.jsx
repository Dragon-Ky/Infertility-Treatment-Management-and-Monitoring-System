import PrivateRoutes from "../components/PrivateRoutes";
import LayoutDefault from "../layout/LayoutDefault";
import Home from "../pages/Home";
import Login from "../pages/Login";
import AdminDashboard from "../pages/Admin/Dashboard";
// import DoctorDashboard from "../pages/Doctor/Dashboard";

export const routes = [
  {
    path: "/",
    element: <LayoutDefault />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/403",
        element: <div>Bạn không có quyền truy cập trang này!</div>,
      },
    ],
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
  // {
  //   element: <PrivateRoutes allowRoles={["Doctor"]} />,
  //   children: [
  //     {
  //       path: "/doctor",
  //       element: <LayoutDefault />,
  //       children: [{ path: "dashboard", element: <DoctorDashboard /> }],
  //     },
  //   ],
  // },
];
