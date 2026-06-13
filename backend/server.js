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

// Middlewares
const allowedOrigins = [
  'https://document-expiry-frontend.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    return callback(new Error('CORS not allowed for: ' + origin), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
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

