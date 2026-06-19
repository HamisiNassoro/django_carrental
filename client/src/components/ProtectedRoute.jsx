import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Spinner from "./Spinner";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { user, isLoading, isInitialized } = useSelector((state) => state.auth);

  if (!isInitialized || isLoading) {
    return <Spinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
};

export default ProtectedRoute;
