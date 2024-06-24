// src/AuthContext.js

import React, { createContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        token: localStorage.getItem('token') || '',
        user: JSON.parse(localStorage.getItem('user')) || null,
    });

    const navigate = useNavigate();

    const loginUser = async (username, password) => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/login/', {
                username,
                password,
            });
            const { token, user } = response.data;
            setAuthState({ token, user });
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            throw error;  // Ensure error is thrown
        }
    };

    const registerUser = async (username, email, password, name, credits) => { 
        try {
            await axios.post('http://127.0.0.1:8000/api/register/', {
                username,
                email,  
                password,
                name,
                credits,
            });
            await loginUser(username, password);
        } catch (error) {
            console.error(error);
            throw error;  
        }
    };

    const logoutUser = () => {
        setAuthState({ token: '', user: null });
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ authState, loginUser, registerUser, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthProvider, AuthContext };
