import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Dashboard } from "./dashboard/dashboard";
import { NewCustomer } from "./new-customer/new-customer";
import { Withdraw } from "./withdraw/withdraw";
import { Transfer } from "./transfer/transfer";
import { Transactions } from "./Transactions/transactions";
import { LogIn } from "./Login/login";
import { Setting } from "./Settings/setting";
import { useAuth } from "./Auth/auth"; // Assuming you have an AuthContext
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const ProtectedRoute = ({ element, ...rest }) => {
  const [isReady, setIsReady] = useState(false);
  const { user, fetchUserData } = useAuth();
  useEffect(() => {
    fetchUserData();
    // Simulate a 10-second delay
    const delay = setTimeout(() => {
      setIsReady(true);
    }, 1000); // 10000 milliseconds = 10 seconds

    // Clear the timeout if the component unmounts or if you want to stop the delay for any reason
    return () => clearTimeout(delay);
  }, []); // Run onc
  if (isReady) {
    // If the user is authenticated, open the link. If user is not authenticated, redirect to login page
    return user ? (
      element
    ) : (
      <Navigate to="/login" replace state={{ from: rest.location }} />
    );
  } else {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }
};

export function AppRoute() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LogIn />} />
        <Route path="/new" element={<NewCustomer />} />
        <Route path="/" element={<ProtectedRoute element={<Dashboard />} />} />
        <Route
          path="/withdraw"
          element={<ProtectedRoute element={<Withdraw />} />}
        />
        <Route
          path="/setting"
          element={<ProtectedRoute element={<Setting />} />}
        />
        <Route
          path="/transactions"
          element={<ProtectedRoute element={<Transactions />} />}
        />
        <Route
          path="/transfer"
          element={<ProtectedRoute element={<Transfer />} />}
        />
      </Routes>
    </BrowserRouter>
  );
}
