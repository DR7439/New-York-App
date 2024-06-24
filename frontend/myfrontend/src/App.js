// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { NavigationProvider } from './NavigationContext';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import PasswordResetRequest from './PasswordResetRequest';
import PasswordResetConfirm from './PasswordResetConfirm';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

const App = () => {
    return (
        <Router>
            <NavigationProvider>
                <AuthProvider>
                    <Routes>
                        <Route element={<PublicRoute />}>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/password-reset" element={<PasswordResetRequest />} />
                            <Route path="/reset-password/:uidb64/:token" element={<PasswordResetConfirm />} />
                        </Route>
                        <Route element={<PrivateRoute />}>
                            <Route path="/dashboard" element={<Dashboard />} />
                        </Route>
                        <Route path="*" element={<Navigate to="/dashboard" />} />
                    </Routes>
                </AuthProvider>
            </NavigationProvider>
        </Router>
    );
};

export default App;
