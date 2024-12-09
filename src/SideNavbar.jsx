import React from 'react';
import './SideNavbar.css'; // Include styling for the sidebar

const SideNavbar = () => {
    return (
        <div className="side-navbar">
            <div className="navbar-header">
                <h2>Admin Panel</h2>
            </div>
            <ul>
                <li><a href="#">Dashboard</a></li>
                <li><a href="#">Manage Users</a></li>
                <li><a href="#">Reports</a></li>
                <li><a href="#">Settings</a></li>
            </ul>
        </div>
    );
};

export default SideNavbar;
