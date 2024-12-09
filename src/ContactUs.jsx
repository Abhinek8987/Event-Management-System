import React, { useState } from 'react';
import './ContactUs.css'; // Import the CSS file

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false); // Track form submission

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send form data to Formspree
    const form = e.target;
    const formData = new FormData(form);

    fetch('https://formspree.io/f/xanwgkgq', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
      },
    })
      .then((response) => {
        if (response.ok) {
          setSubmitted(true);
        } else {
          alert('There was a problem submitting your form. Please try again.');
        }
      })
      .catch(() => {
        alert('Error sending the message. Please try again.');
      });
  };

  // If form is submitted, show the "Thank You" message
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

  // Render contact form and address details side by side
  return (
    <div className="contact-page">
      {/* Contact form */}
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

      {/* Address details */}
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
