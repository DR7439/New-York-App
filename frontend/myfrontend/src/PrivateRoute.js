// src/PrivateRoute.js

import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const PrivateRoute = () => {
    const { authState } = useContext(AuthContext);

    return authState.token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
