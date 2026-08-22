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

// Security Middleware (Configured for open API access)
app.use(helmet({
  crossOriginResourcePolicy: false,
  contentSecurityPolicy: false,
}));

// CORS Configuration - Permissive for Render & Vercel
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With']
}));

// Preflight CORS handler for all routes
app.options('*', cors());

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Safe uploads directory
const uploadsPath = path.join(__dirname, 'uploads');
try {
  if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
  }
  app.use('/uploads', express.static(uploadsPath));
} catch (e) {}

// Health check on root and /api/health
app.get('/api/health', (req, res) => res.json({ status: 'healthy', version: '1.0.0' }));
app.get('/health', (req, res) => res.json({ status: 'healthy', version: '1.0.0' }));

// Bind routes to BOTH /api/* AND /* so missing /api in URL never fails!
const bindRoutes = (prefix = '') => {
  app.use(`${prefix}/auth`, authRoutes);
  app.use(`${prefix}/students`, studentRoutes);
  app.use(`${prefix}/forms`, formRoutes);
  app.use(`${prefix}/holidays`, holidayRoutes);
  app.use(`${prefix}/announcements`, announcementRoutes);
  app.use(`${prefix}/leaves`, leaveRoutes);
  app.use(`${prefix}/academics`, academicRoutes);
  app.use(`${prefix}/analytics`, analyticsRoutes);
};

bindRoutes('/api');
bindRoutes(''); // Fallback without /api

app.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'LDRP CE-A Class Command Center API is LIVE!',
    login_url: '/api/auth/login'
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;