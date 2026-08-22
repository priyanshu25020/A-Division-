const express = require('express');
const router = express.Router();
const { readDb, writeDb } = require('../data/db');
const { authenticateToken, requireRoles } = require('../middleware/security');

// GET /api/announcements
router.get('/', authenticateToken, (req, res) => {
  const db = readDb();
  let list = db.announcements || [];

  // If student is in a specific group, only show class-wide (target_group null) or their target_group
  if (req.user.role === 'STUDENT' || req.user.role === 'GROUP_COORD') {
    list = list.filter(a => a.target_group === null || a.target_group === req.user.group_id);
  }

  const urgentAlert = list.find(a => a.priority === 'URGENT');

  res.json({
    success: true,
    urgent_alert: urgentAlert || null,
    announcements: list
  });
});

// POST /api/announcements (Create announcement)
router.post('/', authenticateToken, requireRoles('MENTOR', 'CLASS_COORD', 'GROUP_COORD'), (req, res) => {
  const { title, content, priority, target_group } = req.body;

  if (!title || !content) {
    return res.status(400).json({ success: false, message: 'Title and content are required.' });
  }

  const db = readDb();

  // Group coordinators can only post to their assigned group
  let target = target_group || null;
  if (req.user.role === 'GROUP_COORD') {
    target = req.user.coord_group_id || req.user.group_id;
  }

  let roleLabel = 'Student';
  if (req.user.role === 'MENTOR') roleLabel = 'Mentor';
  else if (req.user.role === 'CLASS_COORD') roleLabel = 'Class Coordinator';
  else if (req.user.role === 'GROUP_COORD') roleLabel = `Group ${target || req.user.group_id} Coordinator`;

  const newAnn = {
    id: `ann-${Date.now()}`,
    title,
    content,
    priority: priority || 'NORMAL',
    posted_by_name: req.user.full_name,
    posted_by_role: roleLabel,
    target_group: target ? parseInt(target) : null,
    created_at: new Date().toISOString()
  };

  db.announcements.unshift(newAnn);
  writeDb(db);

  res.json({ success: true, message: 'Announcement broadcasted successfully!', announcement: newAnn });
});

// DELETE /api/announcements/:id
router.delete('/:id', authenticateToken, requireRoles('MENTOR', 'CLASS_COORD'), (req, res) => {
  const db = readDb();
  db.announcements = db.announcements.filter(a => a.id !== req.params.id);
  writeDb(db);
  res.json({ success: true, message: 'Announcement deleted.' });
});

module.exports = router;
