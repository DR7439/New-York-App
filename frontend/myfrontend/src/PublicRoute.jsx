// src/PublicRoute.js

import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import AuthLayout from './components/authentication/AuthLayout';

const PublicRoute = () => {
    const { authState } = useContext(AuthContext);

    return authState.token ? <Navigate to="/" /> : <AuthLayout />;
};

export default PublicRoute;
