import React, { useState } from 'react';
import axios from 'axios';

const PasswordResetRequest = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://127.0.0.1:8000/api/password-reset/', { email });
            setMessage('Password reset link sent to your email');
        } catch (error) {
            setMessage('Error sending password reset link');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
            />
            <button type="submit">Send Password Reset Link</button>
            {message && <p>{message}</p>}
        </form>
    );
};

export default PasswordResetRequest;
