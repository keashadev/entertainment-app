const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables

const movieRoutes = require('./routes/movieRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Middleware
app.use(cors());
app.use(express.json());

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'active',
    dbState: mongoose.connection.readyState, // 0=disconnected, 1=connected
    timestamp: new Date().toISOString()
  });
});

// Routes configuration
app.use('/api/entertainment', movieRoutes);
app.use('/api/auth', authRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[ServerError]', err.stack);
  res.status(500).send('Internal Server Error');
});

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
