const express = require('express');
const router = express.Router();
const { readDb } = require('../data/db');
const { authenticateToken } = require('../middleware/security');

// GET /api/academics/subjects
router.get('/subjects', authenticateToken, (req, res) => {
  const db = readDb();
  res.json({ success: true, subjects: db.subjects || [] });
});

// GET /api/academics/timetable
router.get('/timetable', authenticateToken, (req, res) => {
  const db = readDb();
  res.json({ success: true, timetable: db.timetable || [] });
});

module.exports = router;
