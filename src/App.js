import React, { useState } from "react";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  Navigate,
} from "react-router-dom";
import TablePage from "./components/TablePage";
import LoginPage from "./pages/LoginPage";
import ClientTable from "./components/ClientTable";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <Routes>
        {isLoggedIn ? (
          <Route path="/table" element={<TablePage />} />
        ) : (
          <Route
            path="/login"
            element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
          />
        )}
        <Route path="/client-table" element={<ClientTable />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
