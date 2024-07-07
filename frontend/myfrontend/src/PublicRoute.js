// src/PublicRoute.js

import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const PublicRoute = () => {
    const { authState } = useContext(AuthContext);

    return authState.token ? <Navigate to="/" /> : <Outlet />;
};

export default PublicRoute;
