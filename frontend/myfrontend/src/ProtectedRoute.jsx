// src/ProtectedRoute.js

import React, { useContext } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const ProtectedRoute = ({ component: Component, ...rest }) => {
    const { authState } = useContext(AuthContext);

    return (
        <Route
            {...rest}
            element={authState.token ? <Component /> : <Navigate to="/login" />}
        />
    );
};

export default ProtectedRoute;
