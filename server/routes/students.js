const express = require('express');
const router = express.Router();
const { readDb } = require('../data/db');
const { authenticateToken } = require('../middleware/security');

// GET /api/students
router.get('/', authenticateToken, (req, res) => {
  const db = readDb();
  const { group, search, role } = req.query;

  let students = db.users
    .filter(u => u.role !== 'MENTOR')
    .map(u => {
      const { password, ...safe } = u;
      const groupInfo = db.groups.find(g => g.id === u.group_id);
      return {
        ...safe,
        group_name: groupInfo ? groupInfo.name : 'Unassigned',
        group_number: groupInfo ? groupInfo.group_number : null
      };
    });

  if (group) {
    students = students.filter(s => s.group_id === parseInt(group));
  }

  if (role) {
    students = students.filter(s => s.role === role);
  }

  if (search) {
    const q = search.toLowerCase().trim();
    students = students.filter(s => 
      s.full_name.toLowerCase().includes(q) ||
      s.roll_no.toLowerCase().includes(q) ||
      s.enrollment_no.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q)
    );
  }

  // Sort logically by roll number
  students.sort((a, b) => {
    const aNum = parseInt(a.roll_no);
    const bNum = parseInt(b.roll_no);
    if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum;
    return a.roll_no.localeCompare(b.roll_no);
  });

  res.json({
    success: true,
    total: students.length,
    students
  });
});

// GET /api/students/groups
router.get('/groups', authenticateToken, (req, res) => {
  const db = readDb();
  const groups = db.groups.map(g => {
    const members = db.users.filter(u => u.group_id === g.id && u.role !== 'MENTOR');
    const avgAttendance = members.length > 0
      ? Math.round(members.reduce((acc, m) => acc + (m.attendance_pct || 85), 0) / members.length)
      : 85;

    return {
      ...g,
      member_count: members.length,
      average_attendance: avgAttendance,
      members: members.map(m => ({
        id: m.id,
        roll_no: m.roll_no,
        enrollment_no: m.enrollment_no,
        full_name: m.full_name,
        role: m.role,
        attendance_pct: m.attendance_pct,
        phone: m.phone
      }))
    };
  });

  res.json({ success: true, groups });
});

// GET /api/students/:id
router.get('/:id', authenticateToken, (req, res) => {
  const db = readDb();
  const user = db.users.find(u => u.id === req.params.id || u.roll_no === req.params.id);

  if (!user) {
    return res.status(404).json({ success: false, message: 'Student profile not found.' });
  }

  const { password, ...safeUser } = user;
  const groupInfo = db.groups.find(g => g.id === user.group_id);
  const submissions = db.submissions.filter(s => s.student_id === user.id);
  const leaves = db.leaves.filter(l => l.student_id === user.id);

  res.json({
    success: true,
    student: {
      ...safeUser,
      group: groupInfo,
      submissions_count: submissions.length,
      submissions: submissions,
      leaves: leaves
    }
  });
});

module.exports = router;
