import React, { createContext, useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const baseURL = "http://localhost:8000/api";
const AuthContext = createContext();
export default AuthContext;

export const AuthProvider = ({ children, disableTokenCheck = false }) => {
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );

  const [user, setUser] = useState(() => {
    const tokens = localStorage.getItem("authTokens");
    return tokens ? jwt_decode(JSON.parse(tokens).access) : null;
  });

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const checkTokenValidity = () => {
    if (authTokens) {
      const decodedToken = jwt_decode(authTokens.access);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem("authTokens");
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    if (!disableTokenCheck) {
      checkTokenValidity();
      const interval = setInterval(checkTokenValidity, 60000);
      return () => clearInterval(interval);
    }
    setLoading(false);
  }, [authTokens, navigate, disableTokenCheck]);

  const loginUser = async (email, password) => {
    const response = await fetch(baseURL + "/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();

    if (response.status === 200) {
      console.log("Logged In Successfully");
      setAuthTokens(data);
      setUser(jwt_decode(data.access));
      localStorage.setItem("authTokens", JSON.stringify(data));
      await fetch(baseURL + "/set-online/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.access}`,
        },
      });
      navigate("/");
    } else {
      Swal.fire({
        title: "Login error",
        icon: "error",
        toast: true,
        timer: 2000,
        position: "top",
        timerProgressBar: true,
      });
    }
  };

  const registerUser = async (email, username, password, password2) => {
    const response = await fetch(baseURL + "/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, username, password, password2 }),
    });
    if (response.status === 201) {
      navigate("/login");
    } else {
      Swal.fire({
        title: "Register error",
        icon: "error",
        toast: true,
        timer: 2000,
        position: "top",
        timerProgressBar: true,
      });
    }
  };

  const logoutUser = async () => {
    if (authTokens) {
      await fetch(baseURL + "/set-offline/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens.access}`,
        },
      });
    }

    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    navigate("/login");
  };

  const contextData = {
    user,
    setUser,
    authTokens,
    setAuthTokens,
    registerUser,
    loginUser,
    logoutUser,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
