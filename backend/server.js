const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./utils/db');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
// CORS configuration for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || '*'
    : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to database (skip in test mode - tests will handle connection)
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

// Import routes
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const adminProjectRoutes = require('./routes/adminProjectRoutes');
const clientRoutes = require('./routes/clientRoutes');
const adminClientRoutes = require('./routes/adminClientRoutes');
const contactRoutes = require('./routes/contactRoutes');
const newsletterRoutes = require('./routes/newsletterRoutes');
const adminContactRoutes = require('./routes/adminContactRoutes');
const adminNewsletterRoutes = require('./routes/adminNewsletterRoutes');

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'MERN Showcase Platform API' });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/admin/projects', adminProjectRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/admin/clients', adminClientRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/admin/contacts', adminContactRoutes);
app.use('/api/admin/subscriptions', adminNewsletterRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Start server only if not in test mode
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
}

module.exports = app;
