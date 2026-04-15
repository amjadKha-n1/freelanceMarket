import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import AdminDashboard from "./AdminDashboard";
import FreelancerDashboard from "./FreelancerDashboard";
import ClientDashboard from "./ClientDashboard";

const DashboardRouter = () => {
  const { user } = useContext(AuthContext);
  if (!user) {
    return <Navigate to="/login" />;
  }
  switch (user.role) {
    case "client":
      return <ClientDashboard />;
    case "freelancer":
      return <FreelancerDashboard />;
    case "admin":
      return <AdminDashboard />;
    default:
      return <Navigate to="/" />;
  }
};
export default DashboardRouter;
