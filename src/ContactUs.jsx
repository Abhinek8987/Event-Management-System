import React, { useState } from 'react';
import './ContactUs.css'; // Ensure this file exists

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
      } else {
        alert(data.message || 'Failed to submit the form.');
      }
    } catch (error) {
      alert('Error submitting the form. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="thank-you-container">
        <div className="thank-you-message">
          <h1>Thank You!</h1>
          <p>We have received your message and will get back to you shortly.</p>
          <a href="/" className="back-to-home">Back to Home</a>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-page">
      <div className="contact-form-container">
        <div className="contact-us">
          <h2>Contact Us</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                required
              />
            </div>
            <div>
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email ID"
                required
              />
            </div>
            <div>
              <label>Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject"
                required
              />
            </div>
            <div>
              <label>Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write Your Message"
                required
              />
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
      <div className="contact-details-container">
        <div className="contact-details">
          <h2>Our Address</h2>
          <p>1234 Example Street</p>
          <p>City, State, 56789</p>
          <p>Email: contact@example.com</p>
          <p>Phone: (123) 456-7890</p>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
