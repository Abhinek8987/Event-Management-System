import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Dashboard from './Dashboard';
import VenuePage from './VenuePage';
import PackagePage from './PackagePage'; // Add the PackagePage import
import './App.css';

const App = () => {
    return (
        <Router>
            <div>
                {/* Navbar */}
                <nav className="navbar">
                    <div className="navbar-logo">
                        <span className="logo-text">Event Management</span>
                    </div>
                    <ul className="navbar-links">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/venue">Venue</Link></li> {/* Link to Venue Page */}
                        <li><Link to="/packages">Package</Link></li> {/* Link to Package Page */}
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                    <div className="navbar-contact">
                        <a href="tel:9993639672">9993639672</a>
                        <a href="tel:07554056322">07554056322</a>
                    </div>
                </nav>

                {/* Routes */}
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/venue" element={<VenuePage />} />
                    <Route path="/packages" element={<PackagePage />} /> {/* Route for Package Page */}
                </Routes>
            </div>
        </Router>
    );
};

export default App;
