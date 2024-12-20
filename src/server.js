import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:5173' })); // Allow CORS for React frontend
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/event-management', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Define Contact Schema
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
}, { timestamps: true });

const Contact = mongoose.model('Contact', contactSchema);

// Define Enquiry Schema
const enquirySchema = new mongoose.Schema({
  name: String,
  mobile: String,
  eventDate: Date,
}, { timestamps: true });

const Enquiry = mongoose.model('Enquiry', enquirySchema);

// POST route to save contact form data
app.post('/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    const newContact = new Contact({ name, email, subject, message });
    await newContact.save();
    res.status(200).json({ message: 'Message saved successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to save message' });
  }
});

// POST route to save enquiry form data
app.post('/enquiry', async (req, res) => {
  const { name, mobile, eventDate } = req.body;

  try {
    const newEnquiry = new Enquiry({ name, mobile, eventDate });
    await newEnquiry.save();
    res.status(200).json({ message: 'Enquiry submitted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to submit enquiry' });
  }
});

// Server port
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
