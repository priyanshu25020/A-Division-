const express = require('express');
const router = express.Router();
const { readDb, writeDb } = require('../data/db');
const { authenticateToken, requireRoles } = require('../middleware/security');

// GET /api/holidays/active-poll
router.get('/active-poll', authenticateToken, (req, res) => {
  const db = readDb();
  const holidayForm = db.forms.find(f => f.form_type === 'HOLIDAY_DECLARATION' && f.is_active);

  if (!holidayForm) {
    return res.json({ success: true, poll: null, message: 'No active holiday declaration poll.' });
  }

  const submissions = db.submissions.filter(s => s.form_id === holidayForm.id);
  const totalStudents = db.users.filter(u => u.role !== 'MENTOR');
  const userSub = submissions.find(s => s.student_id === req.user.id);

  // Group-level summary
  let attendingCount = 0;
  let absentCount = 0;
  let commutingCount = 0;

  submissions.forEach(s => {
    const val = (s.response_data && s.response_data.q1) || '';
    if (val.includes('Present') || val.includes('attend')) attendingCount++;
    else if (val.includes('absent') || val.includes('Absent')) absentCount++;
    else commutingCount++;
  });

  const notRespondedCount = totalStudents.length - submissions.length;

  const groupBreakdown = db.groups.map(g => {
    const groupMembers = db.users.filter(u => u.group_id === g.id && u.role !== 'MENTOR');
    const groupSubs = submissions.filter(s => s.group_id === g.id);
    return {
      group_id: g.id,
      group_name: g.name,
      coordinator_name: g.coordinator_name,
      total: groupMembers.length,
      submitted: groupSubs.length,
      pending: groupMembers.length - groupSubs.length,
      is_complete: groupSubs.length === groupMembers.length
    };
  });

  res.json({
    success: true,
    poll: {
      ...holidayForm,
      radar: {
        total_students: totalStudents.length,
        submitted: submissions.length,
        pending: notRespondedCount,
        attending: attendingCount,
        absent: absentCount,
        commuting: commutingCount,
        attendance_rate: Math.round((attendingCount / (submissions.length || 1)) * 100),
        completion_rate: Math.round((submissions.length / totalStudents.length) * 100)
      },
      group_breakdown: groupBreakdown,
      user_response: userSub ? userSub.response_data : null
    }
  });
});

// POST /api/holidays/vote
router.post('/vote', authenticateToken, (req, res) => {
  const { form_id, choice, reason } = req.body;
  const db = readDb();
  const form = db.forms.find(f => f.id === form_id || (f.form_type === 'HOLIDAY_DECLARATION' && f.is_active));

  if (!form) {
    return res.status(404).json({ success: false, message: 'Holiday declaration form not found.' });
  }

  const existingIdx = db.submissions.findIndex(s => s.form_id === form.id && s.student_id === req.user.id);
  const record = {
    id: existingIdx >= 0 ? db.submissions[existingIdx].id : `sub-${Date.now()}`,
    form_id: form.id,
    student_id: req.user.id,
    student_name: req.user.full_name,
    roll_no: req.user.roll_no,
    enrollment_no: req.user.enrollment_no,
    group_id: req.user.group_id,
    response_data: {
      q1: choice,
      q2: reason || ''
    },
    status: 'VERIFIED',
    submitted_at: new Date().toISOString()
  };

  if (existingIdx >= 0) {
    db.submissions[existingIdx] = record;
  } else {
    db.submissions.push(record);
  }

  writeDb(db);
  res.json({ success: true, message: 'Attendance declaration submitted successfully!', vote: record });
});

module.exports = router;
