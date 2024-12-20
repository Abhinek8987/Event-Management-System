import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./PackagePage.css";
import axios from "axios";

const PackagePage = () => {
    const location = useLocation();
    const selectedEvent = location.state?.selectedEvent || "No event selected";
    const selectedVenue = location.state?.selectedVenue || "No venue selected";

    const [showForm, setShowForm] = useState(false);
    const [showThankYou, setShowThankYou] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        mobile: "",
        eventDate: new Date().toISOString().split("T")[0], // Default to current date
        selectedEvent,
        selectedVenue,
    });
    const [formErrors, setFormErrors] = useState({
        eventDate: "",
    });

    const toggleForm = () => {
        setShowForm(!showForm);
        setShowThankYou(false); // Ensure thank you message resets
        setFormData({
            name: "",
            mobile: "",
            eventDate: new Date().toISOString().split("T")[0],
            selectedEvent,
            selectedVenue,
        }); // Reset form fields
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        let errors = {};
        if (new Date(formData.eventDate) < new Date()) {
            errors.eventDate = "Event date cannot be in the past.";
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return; // Don't submit if validation fails
        }

        console.log("Submitting Form Data:", formData); // Log data before submission

        try {
            await axios.post("http://localhost:5000/enquiry", formData);
            setShowThankYou(true); // Show Thank You page
        } catch (error) {
            console.error("Error submitting enquiry:", error);
        }
    };

    return (
        <div className="package-container" id="package">
            <h1>Our Packages</h1>
            <p className="selected-event">
                Selected Event: <span>{selectedEvent}</span>
            </p>
            <p className="selected-event">Selected Venue: <span>{selectedVenue}</span></p>

            <div className="package-grid">
                {["Silver - S", "Silver - M", "Silver - L"].map((pkg, idx) => (
                    <PackageCard
                        key={idx}
                        title={pkg}
                        price={["₹40,000", "₹95,000", "₹1,20,000"][idx]}
                        guests={["100 guests", "500 guests", "1000 guests"][idx]}
                        features={["Meal", "Music", "Garden"]}
                        onDropdownClick={toggleForm}
                    />
                ))}
                {["Gold - S", "Gold - M", "Gold - L"].map((pkg, idx) => (
                    <PackageCard
                        key={idx}
                        title={pkg}
                        price={["₹80,000", "₹1,50,000", "₹2,00,000"][idx]}
                        guests={["150 guests", "700 guests", "1500 guests"][idx]}
                        features={[
                            "Meal",
                            "Music",
                            "Garden",
                            ...(idx > 0 ? ["Photography"] : []),
                            ...(idx > 1 ? ["Decoration", "Light Show"] : []),
                        ]}
                        onDropdownClick={toggleForm}
                    />
                ))}
            </div>

            {/* Enquiry Form */}
            {showForm && (
                <div className="form-overlay">
                    <div className="form-container">
                        <button className="close-btn" onClick={toggleForm}>
                            ×
                        </button>

                        {!showThankYou ? (
                            <>
                                <h2>Venue Booking Enquiry</h2>
                                <form onSubmit={handleSubmit}>
                                    <label>Name :</label>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Enter your name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                    <label>Mobile No. :</label>
                                    <input
                                        type="tel"
                                        name="mobile"
                                        placeholder="Enter mobile number"
                                        value={formData.mobile}
                                        onChange={handleChange}
                                        required
                                    />
                                    <label>Event Date :</label>
                                    <input
                                        type="date"
                                        name="eventDate"
                                        value={formData.eventDate}
                                        onChange={handleChange}
                                        min={new Date().toISOString().split("T")[0]} // Prevent past dates
                                        required
                                    />
                                    
                                    {formErrors.eventDate && <p className="error">{formErrors.eventDate}</p>}
                                    <button type="submit">Submit</button>
                                </form>
                            </>
                        ) : (
                            <div className="thank-you">
                                <h2>Thank You!</h2>
                                <p>Your enquiry has been successfully submitted.</p>
                                <p>We will contact you shortly!</p>
                                <button onClick={toggleForm}>Close</button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const PackageCard = ({ title, price, guests, features, onDropdownClick }) => (
    <div className="package-card">
        <h2>{title}</h2>
        <p>From {price}</p>
        <p>Upto {guests}</p>
        <ul>
            {features.map((feature, idx) => (
                <li key={idx}>{feature}</li>
            ))}
        </ul>
        <div className="dropdown-icon" onClick={onDropdownClick}>
            <span>▼</span>
        </div>
    </div>
);

export default PackagePage;
