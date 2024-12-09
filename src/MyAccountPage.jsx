import React from 'react';
import './App.css';

const MyAccountPage = ({ userDetails }) => {
    return (
        <div className="my-account-page">
            <h2>My Account</h2>
            <div className="account-details">
                <p><strong>Name:</strong> {userDetails.name}</p>
                <p><strong>Email:</strong> {userDetails.email}</p>
                <p><strong>Phone:</strong> {userDetails.phone}</p>
            </div>
        </div>
    );
};

export default MyAccountPage;
