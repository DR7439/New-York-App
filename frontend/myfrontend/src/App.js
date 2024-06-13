// src/App.js

import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import { NavigationProvider } from "./NavigationContext";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import { ConfigProvider } from "antd";

const App = () => {
  return (
    <Router>
      <NavigationProvider>
        <ConfigProvider theme={{ hashed: false, token: {
            fontFamily: 'Roboto',
        } }}>
          <AuthProvider>
            <Routes>
              <Route element={<PublicRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Route>
              <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
              </Route>
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </AuthProvider>
        </ConfigProvider>
      </NavigationProvider>
    </Router>
  );
};

export default App;
