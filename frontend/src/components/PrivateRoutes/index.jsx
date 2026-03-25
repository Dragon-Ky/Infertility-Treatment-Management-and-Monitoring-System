import { Navigate, Outlet } from "react-router-dom";

function PrivateRoutes({ allowRoles }) {
  //Get token and info user from localStorage
  const token = localStorage.getItem("access_token");
  const userJson = localStorage.getItem("user");
  const user = userJson ? JSON.parse(userJson) : null;

  // Check token valid?
  if (!token || !user) return <Navigate to="/login" replace />;

  // Get Role of User
  const userRole = user.roles?.[0]?.name;

  // Check access (quyền truy cập) of role
  if (allowRoles && allowRoles.includes(userRole))
    return <Navigate to="/403" replace />;

  //After everything
  return <Outlet />;
}

export default PrivateRoutes;
