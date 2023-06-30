import React, { createContext, useEffect, useState } from "react";
import authService from "../services/auth.service";

export const TOKEN_NAME = "authToken";

const AuthContext = createContext();
function AuthProviderWrapper({ children }) {
  const [userData, setUserData] = useState({
    user: null,
    loading: true,
    error: null,
  });
  // const AuthContextWrapper = ({ children }) => {
  //   const [userData, setUserData] = useState({
  //     user: null,
  //     loading: true,
  //     error: null,
  //   });

  useEffect(() => {
    authenticate();
  }, []);

  const storeToken = (token) => {
    //espera el TOKEN y lo almacena en localStorage
    localStorage.setItem(TOKEN_NAME, token);
  };

  const removeToken = () => {
    localStorage.removeItem(TOKEN_NAME); //eliminar token al cerrar sesion en localstorage
  };

  const logout = () => {
    setUserData((prevData) => ({
      ...prevData,
      loading: false,
      user: null,
    }));
    removeToken();
  };

  const authenticate = async () => {
    //verifica que el token coincide.solicitud al servidor para ver si coincide con los headers
    const token = localStorage.getItem(TOKEN_NAME);
    if (!token) {
      logout();
    }
    setUserData((prevData) => ({
      ...prevData,
      loading: true,
    }));
    try {
      const user = await authService.verify(token);
      setUserData((prevData) => ({
        ...prevData,
        loading: false,
        user,
      }));
    } catch (err) {
      logout();
      setUserData((prevData) => ({
        ...prevData,
        error: "You are not authenticated!",
      }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        loading: userData.loading,
        user: userData.user,
        storeToken,
        authenticate,
        logout,
        removeToken,
        error: userData.error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProviderWrapper, AuthContext };

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// const API_URL = "http://localhost:5005";

// const AuthContext = React.createContext();

// function AuthProviderWrapper(props) {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [user, setUser] = useState(null);

//   /*
//     Functions for handling the authentication status (isLoggedIn, isLoading, user)
//     will be added here later in the next step
//   */

//   return (
//     <AuthContext.Provider value={{ isLoggedIn, isLoading, user }}>
//       {props.children}
//     </AuthContext.Provider>
//   )
// }
