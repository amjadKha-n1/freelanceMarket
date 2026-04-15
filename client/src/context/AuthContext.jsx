import { createContext, useState, useEffect } from "react";

import API from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await API.get("/auth/me");
        setUser(data.user);
      } catch (error) {
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };
    const token = localStorage.getItem("token");
    if (token) {
      checkUser();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (formData) => {
    const { data } = await API.post("/auth/login", formData);
    localStorage.setItem("token", data.token);
    setUser(data.user);
  };

  const register = async (formData) => {
    const { data } = await API.post("/auth/register", formData);
    localStorage.setItem("token", data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
