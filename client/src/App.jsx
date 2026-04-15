import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Layout from "./components/Layout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import DashboardRouter from "./pages/dashboards/DashboardRouter";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Profile from "./pages/auth/Profile";
import UpdateProfile from "./pages/auth/EditProfile";
import CreateService from "./pages/services/CreateService";
import Services from "./pages/services/Services";
import ServiceDetail from "./pages/services/ServiceDetails";
import UpdateService from "./pages/services/UpdateService";
import BecomeFreelancer from "./pages/auth/BecomeFreelancer";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
import ReviewForm from "./pages/services/ReviewForm";
import Messages from "./pages/Messages";
import SearchServices from "./pages/services/SearchServices";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* public routes */}
          <Route
            path="/"
            element={
              <Layout>
                <Services />
              </Layout>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoutes allowedRoles={["client", "freelancer", "admin"]}>
                <Layout>
                  <DashboardRouter />
                </Layout>
              </ProtectedRoutes>
            }
          />

          <Route
            path="/profile/:id"
            element={
              <ProtectedRoutes allowedRoles={["client", "freelancer"]}>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoutes>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoutes allowedRoles={["client", "freelancer", "admin"]}>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoutes>
            }
          />

          <Route
            path="/edit-profile"
            element={
              <ProtectedRoutes allowedRoles={["client", "freelancer", "admin"]}>
                <Layout>
                  <UpdateProfile />
                </Layout>
              </ProtectedRoutes>
            }
          />
          <Route
            path="become-freelancer"
            element={
              <ProtectedRoutes allowedRoles={["client"]}>
                <Layout>
                  <BecomeFreelancer />
                </Layout>
              </ProtectedRoutes>
            }
          />
          <Route
            path="/services/create-service"
            element={
              <ProtectedRoutes allowedRoles={["freelancer"]}>
                <Layout>
                  <CreateService />
                </Layout>
              </ProtectedRoutes>
            }
          />
          <Route
            path="/services"
            element={
              <Layout>
                <Services />
              </Layout>
            }
          />
          <Route
            path="/services/:id"
            element={
              <Layout>
                <ServiceDetail />
              </Layout>
            }
          />
          <Route
            path="/services/:id/edit"
            element={
              <ProtectedRoutes allowedRoles={["freelancer"]}>
                <Layout>
                  <UpdateService />
                </Layout>
              </ProtectedRoutes>
            }
          />
          <Route
            path="/review/:orderId/:serviceId"
            element={
              <ProtectedRoutes allowedRoles={["client"]}>
                <Layout>
                  <ReviewForm />
                </Layout>
              </ProtectedRoutes>
            }
          />

          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />
          <Route
            path="/messages/:conversationId?"
            element={
              <ProtectedRoutes allowedRoles={["client", "freelancer"]}>
                <Layout>
                  <Messages />
                </Layout>
              </ProtectedRoutes>
            }
          />
          <Route
            path="/search"
            element={
              <Layout>
                <SearchServices />
              </Layout>
            }
          />
          <Route
            path="/about"
            element={
              <Layout>
                <About />
              </Layout>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
