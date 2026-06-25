import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children, roleRequired }) => {
  const token = localStorage.getItem("user-token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);

    // optional role check
    if (roleRequired && decoded.role !== roleRequired) {
      return <h1 style={{ color: "red" }}>403 - Forbidden</h1>;
    }

    return children;
  } catch (err) {
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;  