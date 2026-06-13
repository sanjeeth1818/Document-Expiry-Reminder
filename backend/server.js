const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { initScheduler } = require('./services/scheduler');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

// Initialize Express App
const app = express();

app.use(cors());
app.use(express.json());


// Routes
app.use('/api/persons', require('./routes/persons'));
app.use('/api/documents', require('./routes/documents'));

// Basic health check route
app.get('/', (req, res) => {
  res.send('API is running for Document Expiry & Reminder System');
});

// Initialize Cron Scheduler for daily reminders
initScheduler();

// Start Server (Only listen if not deployed on Vercel)
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

module.exports = app;

