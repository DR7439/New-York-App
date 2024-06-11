// src/Dashboard.js

import React, { useContext } from 'react';
import { AuthContext } from './AuthContext';

const Dashboard = () => {
    const { authState, logoutUser } = useContext(AuthContext);
    const { user } = authState;

    return (
        <div>
            <h1>Welcome to the Dashboard</h1>
            {user && (
                <div>
                    <p>Name: {user.name}</p>
                    <p>Credits: {user.credits}</p>
                </div>
            )}
            <button onClick={logoutUser}>Logout</button>
        </div>
    );
};

export default Dashboard;
