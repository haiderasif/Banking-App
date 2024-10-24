// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [transdata, setTransdata] = useState(null);

  const fetchUserData = async () => {
    try {
      const response = await fetch("http://localhost:3100/auth");
      const data = await response.json();
      console.log(data.message);
      setUser(data.message);
      setUserData(data.userData);
      setTransdata(data.TransactionData);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []); // Run once on mount

  return (
    <AuthContext.Provider value={{ user, userData, fetchUserData, transdata }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const { user, userData, fetchUserData, transdata } = useContext(AuthContext);
  return { user, userData, fetchUserData, transdata };
};
