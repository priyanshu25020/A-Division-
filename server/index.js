const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');
const formRoutes = require('./routes/forms');
const holidayRoutes = require('./routes/holidays');
const announcementRoutes = require('./routes/announcements');
const leaveRoutes = require('./routes/leaves');
const academicRoutes = require('./routes/academics');
const analyticsRoutes = require('./routes/analytics');

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet({
  crossOriginResourcePolicy: false,
  contentSecurityPolicy: false,
}));

// CORS Configuration
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
}));

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Safe uploads directory (Safely handle serverless read-only filesystems)
const uploadsPath = path.join(__dirname, 'uploads');
try {
  if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
  }
  app.use('/uploads', express.static(uploadsPath));
} catch (e) {
  // Ignored in read-only serverless environment
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/holidays', holidayRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/academics', academicRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    name: 'LDRP CE-A Class Command Center API',
    class: 'CE-A',
    institution: 'LDRP-ITR Gandhinagar',
    version: '1.0.0',
    serverless: true,
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'LDRP-ITR CE-A Backend API is LIVE and running on Vercel Serverless!',
    endpoints: [
      '/api/health',
      '/api/auth/demo-accounts',
      '/api/auth/login',
      '/api/forms',
      '/api/students',
      '/api/holidays/active-poll',
      '/api/announcements',
      '/api/academics/subjects'
    ]
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server Exception:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`LDRP CE-A Server running locally on port ${PORT}`);
  });
}

module.exports = app;