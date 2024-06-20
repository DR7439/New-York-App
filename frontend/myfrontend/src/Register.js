// src/Register.js

import React, { useContext, useState } from 'react';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const { registerUser } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');  
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [credits, setCredits] = useState(0);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await registerUser(username, email, password, name, credits);  
            navigate('/dashboard');
        } catch (err) {
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error);
            } else {
                setError('An error occurred. Please try again.');
            }
        }
    };

    const handlePasswordReset = () => { 
        navigate('/password-reset');
    };


    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
            />
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}  
                placeholder="Email"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
            />
            <input
                type="number"
                value={credits}
                onChange={(e) => setCredits(Number(e.target.value))}
                placeholder="Credits"
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit">Register</button>
            <button type="button" onClick={handlePasswordReset}>Forgot Password?</button>
        </form>
    );
};

export default Register;
