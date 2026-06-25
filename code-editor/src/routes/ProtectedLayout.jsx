import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedLayout = () => {
    const token = localStorage.getItem("user-token");
    const location = useLocation();

    const publicRoutes = ["/", "/landing", "/login", "/signup"];

    // allow public routes
    if (publicRoutes.includes(location.pathname)) {
        return <Outlet />;
    }

    // protect everything else
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedLayout;