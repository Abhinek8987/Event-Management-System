import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom"; // Add useNavigate here

import React, { useState, useEffect } from "react";
import { db } from "./firebase"; // Firebase Firestore functions
import { collection, onSnapshot } from "firebase/firestore";
import "./VenuePage.css";

const predefinedVenues = [
  {
    title: "Le Roma Samsara",
    minGuests: "1500-1800 pax",
    rentalCost: "₹ 7,50,000 per function",
    rooms: "80 Rooms",
    rating: "5.0 (2 reviews)",
    description: "Banquet Halls, Marriage Gardens",
    image: "/images/OIP.jpeg",
  },
  {
    title: "Jayamahal Palace Hotel",
    minGuests: "150-2000 pax",
    rentalCost: "Veg: ₹ 1,200 | Non Veg: ₹ 1,800 per plate",
    rooms: "36 Rooms",
    rating: "4.8 (12 reviews)",
    description: "4 Star & Above Wedding Venue",
    image: "/images/hotel1.jpg",
  },
  {
    title: "MoonGate",
    minGuests: "150-2000 pax",
    rentalCost: "₹ 14,00,000 per function",
    rooms: "47 Rooms",
    rating: "4.9 (173 reviews)",
    description: "Banquet Halls, Marriage Gardens",
    image: "/images/hotel2.jpg",
  },
  {
    title: "The Oberoi Udaivilas",
    minGuests: "200-500 pax",
    rentalCost: "₹ 20,00,000 per function",
    rooms: "60 Rooms",
    rating: "5.0 (10 reviews)",
    description: "Luxury Wedding Venue",
    image: "/images/hotel3.jpg",
  },
  {
    title: "Taj Falaknuma Palace",
    minGuests: "150-500 pax",
    rentalCost: "₹ 25,00,000 per function",
    rooms: "40 Rooms",
    rating: "4.9 (8 reviews)",
    description: "5 Star Palace Hotel",
    image: "/images/hotel4.jpg",
  },
  {
    title: "Umaid Bhawan Palace",
    minGuests: "200-1000 pax",
    rentalCost: "₹ 30,00,000 per function",
    rooms: "70 Rooms",
    rating: "5.0 (15 reviews)",
    description: "Royal Wedding Venue",
    image: "/images/hotel5.jpg",
  },
  {
    title: "ITC Grand Bharat",
    minGuests: "300-1200 pax",
    rentalCost: "₹ 18,00,000 per function",
    rooms: "104 Rooms",
    rating: "4.8 (20 reviews)",
    description: "Luxury Banquet Halls",
    image: "/images/hotel6.jpg",
  },
  {
    title: "Radisson Blu",
    minGuests: "150-800 pax",
    rentalCost: "Veg: ₹ 1,500 | Non Veg: ₹ 2,000 per plate",
    rooms: "50 Rooms",
    rating: "4.7 (25 reviews)",
    description: "4 Star Wedding Hotel",
    image: "/images/hotel7.jpg",
  },
  {
    title: "The Leela Palace",
    minGuests: "200-1000 pax",
    rentalCost: "₹ 22,00,000 per function",
    rooms: "80 Rooms",
    rating: "4.9 (18 reviews)",
    description: "Luxury Destination Venue",
    image: "/images/hotel8.jpg",
  },
  {
    title: "The Lalit Ashok",
    minGuests: "250-1200 pax",
    rentalCost: "Veg: ₹ 2,000 | Non Veg: ₹ 2,500 per plate",
    rooms: "60 Rooms",
    rating: "4.6 (35 reviews)",
    description: "Premium Wedding Venue",
    image: "/images/hotel9.jpg",
  },
  {
    title: "White Mist Happy Retreats",
    minGuests: "250-1200 pax",
    rentalCost: "Veg: ₹ 2,000 | Non Veg: ₹ 2,500 per plate",
    rooms: "60 Rooms",
    rating: "4.6 (35 reviews)",
    description: "Premium Wedding Venue",
    image: "/images/hotel10.png",
  },
  {
    title: "JW Marriot Hotel Banglore",
    minGuests: "250-1200 pax",
    rentalCost: "Veg: ₹ 2,000 | Non Veg: ₹ 2,500 per plate",
    rooms: "60 Rooms",
    rating: "4.6 (35 reviews)",
    description: "Premium Wedding Venue",
    image: "/images/hotel11.png",
  },
];

const VenuePage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const selectedEvent = location.state?.selectedEvent || 'No event selected';



  const [view, setView] = useState(localStorage.getItem("venueView") || "grid");
  const [venues, setVenues] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "venues"), (snapshot) => {
      const newVenues = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setVenues(newVenues);
    });

    return () => unsubscribe();
  }, []);

  const toggleView = (newView) => {
    setView(newView);
    localStorage.setItem("venueView", newView);
  };

  const allVenues = [...predefinedVenues, ...venues];
  const handleVenueClick = (venue) => {
    navigate("/packages", { state: { selectedVenue: venue.title, selectedEvent } });
  };


  return (
    <div className="venue-page-container">
      <h1 className="venue-page-title">Our Venues</h1>
      <p className="selected-event">
  Selected Event: <span>{selectedEvent}</span>
</p>



      {/* Toggle Buttons */}
      <div className="toggle-buttons">
        <button
          className={`toggle-button ${view === "grid" ? "active" : ""}`}
          onClick={() => toggleView("grid")}
        >
          Grid View
        </button>
        <button
          className={`toggle-button ${view === "list" ? "active" : ""}`}
          onClick={() => toggleView("list")}
        >
          List View
        </button>
      </div>

      {/* Venue Cards */}
      <div
        className={`venue-cards-container ${
          view === "grid" ? "grid-view" : "list-view"
        }`}
      >
        {allVenues.map((venue, index) => (
          <div className="venue-card" key={index}
          onClick={() => handleVenueClick(venue)}

          >
            <img className="venue-image" src={venue.image} alt={venue.title} />
            <div className="card-text">
              <h2 className="venue-title">{venue.title}</h2>
              <p className="venue-rating">{venue.rating || "No reviews yet"}</p>
              <p className="venue-description">{venue.description}</p>
              <p className="venue-guests">{venue.minGuests || "Guest capacity not specified"}</p>
              <p className="venue-rental">{venue.rentalCost || "Contact for pricing"}</p>
              <p className="venue-rooms">{venue.rooms || "No room information"}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VenuePage;