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
import PasswordResetRequest from "./PasswordResetRequest";
import PasswordResetConfirm from "./PasswordResetConfirm";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import { ConfigProvider } from "antd";
import Credits from "./Credits";
import Settings from "./Settings";
import Onboard from "./Onboard";
import Analytics from "./Analytics";
import { RecoilRoot } from "recoil";
import LandingPage from "./LandingPage";
const App = () => {
  return (
    <Router>
      <RecoilRoot>
        <NavigationProvider>
          <ConfigProvider
            theme={{
              hashed: false,
              components: {
                Table: {
                  rowHoverBg: "#e6f4ff",
                },
              },
              token: {
                fontFamily: "Roboto",
              },
            }}
          >
            <AuthProvider>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route element={<PublicRoute />}>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route
                    path="/password-reset"
                    element={<PasswordResetRequest />}
                  />
                  <Route
                    path="/reset-password/:uidb64/:token"
                    element={<PasswordResetConfirm />}
                  />
                </Route>
                <Route element={<PrivateRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/onboarding" element={<Onboard />} />
                  <Route path="/credits" element={<Credits />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/analytics/:id" element={<Analytics />} />
                </Route>
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </AuthProvider>
          </ConfigProvider>
        </NavigationProvider>
      </RecoilRoot>
    </Router>
  );
};

export default App;
