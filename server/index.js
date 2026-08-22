const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

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
}));

// CORS Configuration (Allows Localhost + Vercel Cloud Domains)
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again after some time.' }
});
app.use('/api/', limiter);

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
    timestamp: new Date().toISOString()
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

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🏛️  LDRP CE-A Command Center Server LIVE on Port ${PORT}`);
  console.log(`🌐  API URL: http://localhost:${PORT}/api/health`);
  console.log(`🎓  Students: 78 | Mentors: 2 | Groups: 8`);
  console.log(`=======================================================`);
});