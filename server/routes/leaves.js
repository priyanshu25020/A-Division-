const express = require('express');
const router = express.Router();
const { readDb, writeDb } = require('../data/db');
const { authenticateToken, requireRoles } = require('../middleware/security');

// GET /api/leaves
router.get('/', authenticateToken, (req, res) => {
  const db = readDb();
  let list = db.leaves || [];

  if (req.user.role === 'STUDENT') {
    list = list.filter(l => l.student_id === req.user.id);
  } else if (req.user.role === 'GROUP_COORD' && req.user.coord_group_id) {
    list = list.filter(l => l.group_id === req.user.coord_group_id);
  }

  res.json({ success: true, leaves: list });
});

// POST /api/leaves (Apply for leave)
router.post('/apply', authenticateToken, (req, res) => {
  const { from_date, to_date, reason } = req.body;

  if (!from_date || !to_date || !reason) {
    return res.status(400).json({ success: false, message: 'Please provide from date, to date, and reason.' });
  }

  const db = readDb();
  const newLeave = {
    id: `leave-${Date.now()}`,
    student_id: req.user.id,
    student_name: req.user.full_name,
    roll_no: req.user.roll_no,
    group_id: req.user.group_id,
    from_date,
    to_date,
    reason,
    medical_proof_url: null,
    coordinator_status: "PENDING",
    mentor_status: "PENDING",
    applied_at: new Date().toISOString()
  };

  db.leaves.unshift(newLeave);
  writeDb(db);

  res.json({ success: true, message: 'Leave application submitted to your Group Coordinator and Mentors!', leave: newLeave });
});

// PATCH /api/leaves/:id/status (Verify by Coordinator or Approve/Reject by Mentor)
router.patch('/:id/status', authenticateToken, requireRoles('MENTOR', 'CLASS_COORD', 'GROUP_COORD'), (req, res) => {
  const { status, level } = req.body; // level = 'coordinator' or 'mentor'
  const db = readDb();
  const leaveIdx = db.leaves.findIndex(l => l.id === req.params.id);

  if (leaveIdx === -1) {
    return res.status(404).json({ success: false, message: 'Leave request not found.' });
  }

  if (req.user.role === 'MENTOR') {
    db.leaves[leaveIdx].mentor_status = status;
    db.leaves[leaveIdx].mentor_reviewed_by = req.user.full_name;
    db.leaves[leaveIdx].mentor_reviewed_at = new Date().toISOString();
  } else {
    db.leaves[leaveIdx].coordinator_status = status;
    db.leaves[leaveIdx].coordinator_reviewed_by = req.user.full_name;
    db.leaves[leaveIdx].coordinator_reviewed_at = new Date().toISOString();
  }

  writeDb(db);
  res.json({ success: true, message: `Leave status updated to ${status}.`, leave: db.leaves[leaveIdx] });
});

module.exports = router;
