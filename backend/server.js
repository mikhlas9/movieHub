const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movies');
const voteRoutes = require('./routes/votes');
const commentRoutes = require('./routes/comments');
const adminRoutes = require('./routes/admin');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const connectDB = async () => {
  try {
    // Build MongoDB URI with specific database name
    let mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/moviehub';
    
    // If MONGODB_URI doesn't include database name, append it
    if (!mongoURI.includes('/moviehub')) {
      // Remove any existing database name and add moviehub
      const baseURI = mongoURI.split('?')[0]; // Remove query params
      const queryParams = mongoURI.includes('?') ? '?' + mongoURI.split('?')[1] : '';
      
      // Remove existing database name if present
      if (baseURI.includes('/', baseURI.indexOf('://') + 3)) {
        const parts = baseURI.split('/');
        parts[parts.length - 1] = 'moviehub'; // Replace database name
        mongoURI = parts.join('/') + queryParams;
      } else {
        // Add database name
        mongoURI = baseURI + '/moviehub' + queryParams;
      }
    }

    console.log('🔗 Connecting to MovieHub database...');
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB - MovieHub database');
    console.log(`📊 Database: ${mongoose.connection.db.databaseName}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Actually call the connectDB function
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'MovieHub API is running',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 API available at http://localhost:${PORT}/api`);
});
