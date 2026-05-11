import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../layouts/DashboardLayout";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F7F5EF]">
        <div className="w-5 h-5 border-2 border-[#D8D4C8] border-t-[#4A7C59] rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <DashboardLayout>{children ? children : <Outlet />}</DashboardLayout>
  );
};

export default ProtectedRoute;
