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

// CORS Configuration - Permissive for Render & Vercel
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With']
}));

// Preflight CORS handler
app.options('*', cors());

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/api/health', (req, res) => res.json({ status: 'healthy', version: '1.0.0', serverless: true }));
app.get('/health', (req, res) => res.json({ status: 'healthy', version: '1.0.0', serverless: true }));

// Bind routes to BOTH /api/* AND /*
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
bindRoutes('');

app.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'LDRP CE-A Class Command Center API is LIVE!',
    endpoints: ['/api/health', '/api/auth/login', '/api/auth/demo-accounts', '/api/forms', '/api/students']
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

// Only start TCP listener when running as standalone Node process (NOT on Vercel Serverless)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`LDRP CE-A Server running locally on port ${PORT}`);
  });
}

module.exports = app;