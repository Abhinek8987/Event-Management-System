// VenuePage.js
import React from 'react';
import './VenuePage.css'; // Add CSS for the layout

const venueCards = [
    { title: 'Hotel Sunshine', minGuests: 150, description: 'Click to know more details', image: 'path_to_image1.jpg' },
    { title: 'Grand Royal', minGuests: 150, description: 'Click to know more details', image: 'path_to_image2.jpg' },
    { title: 'Palace Resort', minGuests: 150, description: 'Click to know more details', image: 'path_to_image3.jpg' },
    { title: 'The Ocean View', minGuests: 150, description: 'Click to know more details', image: 'path_to_image4.jpg' },
    { title: 'City Plaza', minGuests: 150, description: 'Click to know more details', image: 'path_to_image5.jpg' },
    { title: 'The Grand Palace', minGuests: 150, description: 'Click to know more details', image: 'path_to_image6.jpg' },
    { title: 'Elegant Suites', minGuests: 150, description: 'Click to know more details', image: 'path_to_image7.jpg' },
    { title: 'Luxury Inn', minGuests: 150, description: 'Click to know more details', image: 'path_to_image8.jpg' },
    { title: 'The Imperial', minGuests: 150, description: 'Click to know more details', image: 'path_to_image9.jpg' },
    { title: 'Ocean Breeze', minGuests: 150, description: 'Click to know more details', image: 'path_to_image10.jpg' },
];

const VenuePage = () => {
    return (
        <div className="venue-page-container">
            <h1 className="venue-page-title">Our Venues</h1>
            <div className="venue-cards-container">
                {venueCards.map((card, index) => (
                    <div className="venue-card" key={index}>
                        <div className="card-content">
                            <img className="venue-image" src={card.image} alt={card.title} />
                            <div className="card-text">
                                <h2 className="venue-title">{card.title}</h2>
                                <p className="venue-guests">Min Guests: {card.minGuests}</p>
                                <button className="more-details-button">{card.description}</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VenuePage;
