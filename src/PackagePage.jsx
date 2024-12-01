import React from "react";
import "./PackagePage.css"; // Assuming you'll style it separately

const PackagePage = () => {
    return (
        <div className="package-container" id="package">
            <h1>Our Packages</h1>
            <div className="package-grid">
                {/* Silver Packages */}
                <div className="package-card">
                    <h2>Silver - S</h2>
                    <p>From ₹40,000</p>
                    <p>Upto 100 guests</p>
                    <ul>
                        <li>Meal</li>
                        <li>Music</li>
                        <li>Garden</li>
                    </ul>
                </div>
                <div className="package-card">
                    <h2>Silver - M</h2>
                    <p>From ₹95,000</p>
                    <p>Upto 500 guests</p>
                    <ul>
                        <li>Meal</li>
                        <li>Music</li>
                        <li>Garden</li>
                    </ul>
                </div>
                <div className="package-card">
                    <h2>Silver - L</h2>
                    <p>From ₹1,20,000</p>
                    <p>Upto 1000 guests</p>
                    <ul>
                        <li>Meal</li>
                        <li>Music</li>
                        <li>Garden</li>
                    </ul>
                </div>

                {/* Gold Packages */}
                <div className="package-card">
                    <h2>Gold - S</h2>
                    <p>From ₹80,000</p>
                    <p>Upto 150 guests</p>
                    <ul>
                        <li>Meal</li>
                        <li>Music</li>
                        <li>Garden</li>
                        <li>Photography</li>
                    </ul>
                </div>
                <div className="package-card">
                    <h2>Gold - M</h2>
                    <p>From ₹1,50,000</p>
                    <p>Upto 700 guests</p>
                    <ul>
                        <li>Meal</li>
                        <li>Music</li>
                        <li>Garden</li>
                        <li>Photography</li>
                        <li>Decoration</li>
                    </ul>
                </div>
                <div className="package-card">
                    <h2>Gold - L</h2>
                    <p>From ₹2,00,000</p>
                    <p>Upto 1500 guests</p>
                    <ul>
                        <li>Meal</li>
                        <li>Music</li>
                        <li>Garden</li>
                        <li>Photography</li>
                        <li>Decoration</li>
                        <li>Light Show</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default PackagePage;
