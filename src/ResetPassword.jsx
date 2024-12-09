import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, sendPasswordResetEmail } from './firebase';
import './ResetPassword.css';
const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleReset = async (e) => {
        e.preventDefault();
        try {
            await sendPasswordResetEmail(auth, email);
            setMessage('Password reset email sent. Please check your inbox.');
        } catch (err) {
            setError('Error sending password reset email.');
            console.error(err.message);
        }
    };

    return (
        <div className="reset-password-container">
            <h2>Reset Your Password</h2>
            <form onSubmit={handleReset}>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Reset Password</button>
            </form>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
            <p>
                Remember your password?{' '}
                <span onClick={() => navigate('/login')}>Login</span>
            </p>
        </div>
    );
};

export default ResetPassword;
