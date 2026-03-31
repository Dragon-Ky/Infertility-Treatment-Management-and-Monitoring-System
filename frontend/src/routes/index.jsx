import PrivateRoutes from "../components/PrivateRoutes";
import LayoutDefault from "../layout/LayoutDefault";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Error403 from "@/pages/Error403";
import Profile from "../pages/Profile";
import BlogDetail from "@/pages/BlogDetail";
import AdminDashboard from "../pages/Admin/Dashboard";
import DoctorDashboard from "../pages/Doctor/Dashboard";
import Error404 from "@/pages/Error404";
import BlogList from "@/pages/BlogList";

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
        path: "/blog",
        element: <BlogList />,
      },

      { path: "/blog/:id", element: <BlogDetail /> },

      {
        path: "/403",
        element: <Error403 />,
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

  // 404
  {
    path: "*",
    element: <Error404 />,
  },
];
