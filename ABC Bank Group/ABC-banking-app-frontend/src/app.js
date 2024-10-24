import React from "react";
import { AuthProvider } from "./Auth/auth";
import { AppRoute } from "./routes";
function App() {
  return (
    <AuthProvider>
      <AppRoute />
    </AuthProvider>
  );
}

export default App;
