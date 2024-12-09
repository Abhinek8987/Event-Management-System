import React, { useState } from 'react'; // Import useState and useEffect
import { useNavigate } from 'react-router-dom';
import {
    auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    googleProvider,
    signInWithPopup,
} from './firebase';
import { db, setDoc, doc, getDoc } from './firebase'; // Import Firestore functions
import './Registration.css';

const Registration = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLogin, setIsLogin] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false); // New state for admin toggle
    const navigate = useNavigate();

    // Save user data to Firestore
    const saveUserToFirestore = async (user, isAdmin = false) => {
        try {
            await setDoc(doc(db, 'users', user.uid), {
                name: user.displayName || name,
                email: user.email,
                phone: phone || '',
                createdAt: new Date().toISOString(),
                isAdmin: isAdmin, // Store if the user is an admin
            });
            console.log('User data saved successfully');
        } catch (err) {
            console.error('Error saving user data:', err);
            setError('Failed to save user data. Please try again.');
        }
    };

    // Handle Registration
    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await saveUserToFirestore(user, isAdmin); // Pass isAdmin state
            onLogin({ email, name, phone, isAdmin });
            navigate('/dashboard');
        } catch (err) {
            console.error(err.message);
            setError('Registration failed. Please try again.');
        }
    };

    // Handle Login
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            // Check user role from Firestore
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            const userData = userDoc.data();
            
            onLogin({ email: user.email, name: userData.name, phone: userData.phone, isAdmin: userData.isAdmin });
            
            if (userData.isAdmin) {
                navigate('/admin'); // Navigate to the admin panel if admin
            } else {
                navigate('/dashboard'); // Navigate to the user dashboard
            }
        } catch (err) {
            console.error(err.message);
            setError('Login failed. Please check your credentials.');
        }
    };

    // Handle Google Sign-In
    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            await saveUserToFirestore(user, isAdmin); // Pass isAdmin state
            onLogin(user);
            navigate('/dashboard');
        } catch (err) {
            console.error(err.message);
            setError('Google Sign-In failed. Please try again.');
        }
    };

    return (
        <div className="registration-container">
            <h2>{isLogin ? 'Login' : 'Register'}</h2>
            <form onSubmit={isLogin ? handleLogin : handleRegister}>
                {!isLogin && (
                    <>
                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Enter your phone number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </>
                )}
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {!isLogin && (
                    <input
                        type="password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                )}
                {error && <p className="error-message">{error}</p>}
                <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
            </form>
            <div className="google-signin">
                <button onClick={handleGoogleSignIn}>
                    {isLogin ? 'Sign in with Google' : 'Sign up with Google'}
                </button>
            </div>
            <p className="toggle-link">
                {isLogin ? (
                    <>
                        Don't have an account?{' '}
                        <span onClick={() => setIsLogin(false)}>Register</span>
                    </>
                ) : (
                    <>
                        Already have an account?{' '}
                        <span onClick={() => setIsLogin(true)}>Login</span>
                    </>
                )}
            </p>
        </div>
    );
};

export default Registration;