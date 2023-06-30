import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

const Private = ({ children, redirectTo = "/login" }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <Navigate to={redirectTo} />;
  }

  return children;
};

export default Private;
