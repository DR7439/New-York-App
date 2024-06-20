// src/PrivateRoute.js

import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import Layout from './components/Layout';

const PrivateRoute = () => {
    const { authState } = useContext(AuthContext);

    return authState.token ? <Layout/> : <Navigate to="/login" />;
};

export default PrivateRoute;
