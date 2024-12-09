import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import Registration from './Registration';
import ResetPassword from './ResetPassword';
import Dashboard from './Dashboard';
import AdminPanel from './AdminPanel'; // Admin Panel to manage users
import VenuePage from './VenuePage';
import PackagePage from './PackagePage';
import './App.css';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userDetails, setUserDetails] = useState(null); // Store user details

    const handleLogin = (user) => {
        setIsAuthenticated(true);
        setUserDetails(user); // Save user details on login
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setUserDetails(null); // Clear user details on logout
    };

    return (
        <Router>
            <AppRoutes
                isAuthenticated={isAuthenticated}
                userDetails={userDetails}
                handleLogin={handleLogin}
                handleLogout={handleLogout}
            />
        </Router>
    );
};

const Navbar = ({ isAuthenticated, handleLogout, toggleAccountDetails }) => (
    <nav className="navbar">
        <div className="navbar-logo">
            <span className="logo-text">Event Management</span>
        </div>
        <ul className="navbar-links">
            <li><Link to="/dashboard">Home</Link></li>
            <li><Link to="/venue">Venue</Link></li>
            <li><Link to="/packages">Package</Link></li>
            <li><a href="#contact">Contact</a></li>
        </ul>
        <div className="navbar-contact">
            <button
                className="my-account-button"
                onClick={toggleAccountDetails}
                style={{
                    marginLeft: '20px',
                    padding: '8px 12px',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                }}
            >
                My Account
            </button>
            <button
                className="logout-button"
                onClick={handleLogout}
                style={{
                    marginLeft: '10px',
                    padding: '8px 12px',
                    backgroundColor: '#ff4d4d',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                }}
            >
                Logout
            </button>
        </div>
    </nav>
);

const AppRoutes = ({ isAuthenticated, userDetails, handleLogin, handleLogout }) => {
    const navigate = useNavigate();
    const [showAccountDetails, setShowAccountDetails] = useState(false); // Control "My Account" modal visibility

    const handleLogoutClick = () => {
        handleLogout();
        navigate('/');
    };

    const toggleAccountDetails = () => {
        setShowAccountDetails((prev) => !prev);
    };

    return (
        <div>
            {/* Conditionally Render Navbar */}
            {isAuthenticated && !window.location.pathname.startsWith('/admin') && (
                <Navbar
                    isAuthenticated={isAuthenticated}
                    handleLogout={handleLogoutClick}
                    toggleAccountDetails={toggleAccountDetails}
                />
            )}

            {/* Account Details Modal */}
            {showAccountDetails && (
                <div className="account-modal">
                    <div className="modal-content">
                        <h3>User Details</h3>
                        {userDetails ? (
                            <ul>
                                <li><strong>Name:</strong> {userDetails.name}</li>
                                <li><strong>Email:</strong> {userDetails.email}</li>
                                <li><strong>Phone:</strong> {userDetails.phone}</li>
                            </ul>
                        ) : (
                            <p>No user details available.</p>
                        )}
                        <button
                            onClick={toggleAccountDetails}
                            style={{
                                marginTop: '20px',
                                padding: '8px 12px',
                                backgroundColor: '#007bff',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                            }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Routes */}
            <Routes>
                <Route path="/" element={<Registration onLogin={handleLogin} />} />
                <Route path="/login" element={<Registration onLogin={handleLogin} />} />
                <Route
                    path="/dashboard"
                    element={isAuthenticated ? <Dashboard /> : <Registration onLogin={handleLogin} />}
                />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/venue" element={<VenuePage />} />
                <Route path="/packages" element={<PackagePage />} />
                {userDetails?.isAdmin && (
                    <Route path="/admin" element={<AdminPanel userDetails={userDetails} />} /> // Admin-specific route
                )}
            </Routes>
        </div>
    );
};

export default App;
