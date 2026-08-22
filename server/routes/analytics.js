const express = require('express');
const router = express.Router();
const { readDb } = require('../data/db');
const { authenticateToken, requireRoles } = require('../middleware/security');

// GET /api/analytics/overview
router.get('/overview', authenticateToken, (req, res) => {
  const db = readDb();
  const students = db.users.filter(u => u.role !== 'MENTOR');
  const forms = db.forms || [];
  const submissions = db.submissions || [];
  const announcements = db.announcements || [];

  const avgAttendance = Math.round(
    students.reduce((acc, s) => acc + (s.attendance_pct || 85), 0) / (students.length || 1)
  );

  // Group Leaderboard
  const groupLeaderboard = db.groups.map(g => {
    const members = students.filter(s => s.group_id === g.id);
    const activeForm = forms[0];
    const formSubs = activeForm ? submissions.filter(s => s.form_id === activeForm.id && s.group_id === g.id) : [];
    const completionPct = members.length > 0 ? Math.round((formSubs.length / members.length) * 100) : 0;

    return {
      group_id: g.id,
      group_name: g.name,
      badge: g.badge,
      color: g.color,
      coordinator_name: g.coordinator_name,
      total_students: members.length,
      submitted: formSubs.length,
      pending: members.length - formSubs.length,
      completion_pct: completionPct,
      rank: 0
    };
  });

  // Sort groups by completion % descending
  groupLeaderboard.sort((a, b) => b.completion_pct - a.completion_pct);
  groupLeaderboard.forEach((g, idx) => g.rank = idx + 1);

  res.json({
    success: true,
    metrics: {
      total_students: students.length,
      total_groups: db.groups.length,
      active_forms: forms.filter(f => f.is_active).length,
      total_submissions: submissions.length,
      average_attendance: avgAttendance,
      announcements_count: announcements.length
    },
    groupLeaderboard,
    recentAnnouncements: announcements.slice(0, 3)
  });
});

// GET /api/analytics/export/:formId
router.get('/export/:formId', authenticateToken, requireRoles('MENTOR', 'CLASS_COORD'), (req, res) => {
  const db = readDb();
  const form = db.forms.find(f => f.id === req.params.formId);

  if (!form) {
    return res.status(404).json({ success: false, message: 'Form not found.' });
  }

  const submissions = db.submissions.filter(s => s.form_id === form.id);
  const students = db.users.filter(u => u.role !== 'MENTOR');

  const rows = students.map(student => {
    const sub = submissions.find(s => s.student_id === student.id);
    const group = db.groups.find(g => g.id === student.group_id);

    return {
      "Roll No": student.roll_no,
      "Enrollment No": student.enrollment_no,
      "Full Name": student.full_name,
      "Group": group ? group.name : 'Unassigned',
      "Group Coordinator": group ? group.coordinator_name : 'N/A',
      "Phone": student.phone,
      "Status": sub ? sub.status : "NOT SUBMITTED",
      "Response": sub && sub.response_data ? JSON.stringify(sub.response_data) : "N/A",
      "Submission Timestamp": sub ? new Date(sub.submitted_at).toLocaleString('en-IN') : "N/A"
    };
  });

  res.json({
    success: true,
    form_title: form.title,
    export_date: new Date().toISOString(),
    total_records: rows.length,
    rows
  });
});

module.exports = router;
