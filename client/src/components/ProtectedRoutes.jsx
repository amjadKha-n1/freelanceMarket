import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoutes = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }
  if (!allowedRoles.includes(user.role)) {
    if (user.role === "freelancer") {
      return <Navigate to="freelancer-dashboard" />;
    } else if (user.role === "admin") {
      return <Navigate to="admin-dashboard" />;
    } else if (user.role === "client") {
      return <Navigate to="client-dashboard" />;
    } else {
      return <Navigate to="/" />;
    }
  }

  return children;
};

export default ProtectedRoutes;
