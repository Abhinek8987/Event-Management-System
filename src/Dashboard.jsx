import React from 'react';
import './Card.css';  // Assuming you are using this file for styling

const eventCards = [
    { title: 'Birthday', image: './assets/birthday.jpg', description: 'Plan memorable birthday parties with us!' },
    { title: 'Wedding', image: './assets/wedding.jpg', description: 'Make your dream wedding come true.' },
    { title: 'Naming Ceremony', image: './assets/namingceremony.jpg', description: 'A joyous occasion where a newborn or child is given a name, surrounded by family and blessings.' },
    { title: 'Concert', image: './assets/concert.jpg', description: 'Organize energetic and vibrant concerts.' },
    { title: 'Baby Shower', image: './assets/babyshower.jpg', description: 'Celebrate the joy of a new arrival.' },
    { title: 'Engagement', image: './assets/engagement.jpg', description: 'Capture the magic of your engagement.' },
    { title: 'Seminar', image: './assets/seminar.jpg', description: 'Plan professional seminars and workshops.' },
    { title: 'Festival', image: './assets/festival.jpg', description: 'Celebrate festivals with grandeur.' },
];

const packages = [
    { title: 'Customize Package', price: '---', guests: '--', details: '' },
    { title: 'Silver - M', price: '₹9500', guests: '50 guests', details: 'A/C Hall, Speaker, Meal' },
    { title: 'Silver - L', price: '₹18000', guests: '100 guests', details: 'Speaker, A/C Hall, Meal' },
    { title: 'Gold - S', price: '₹5000', guests: '20 guests', details: 'Meal, A/C Hall, Speaker, 4 hours Decoration Catering' },
];

const Dashboard = () => {
  return (
    <div className="dashboard-container">

      <h1 className="dashboard-title">Event Management Dashboard</h1>

      {/* Event Cards Section */}
      <div className="horizontal-cards-container">
        {eventCards.map((card, index) => (
          <div className="card" key={index}>
            <img src={card.image} alt={card.title} className="card-image" />
            <div className="card-content">
              <h2 className="card-title">{card.title}</h2>
              <p className="card-description">{card.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Event Packages Section */}
      <div className="packages-section" id="package">
        <h2 className="section-title">Our Events Packages</h2>
        <div className="packages-container">
          {packages.map((pkg, index) => (
            <div className="package-card" key={index}>
              <h3 className="package-title">{pkg.title}</h3>
              <p className="package-price">From {pkg.price}</p>
              <p className="package-guests">Up to {pkg.guests}</p>
              <p className="package-details">{pkg.details}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
