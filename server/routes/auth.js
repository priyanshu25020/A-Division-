const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { readDb, writeDb } = require('../data/db');
const { JWT_SECRET, authenticateToken } = require('../middleware/security');

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ success: false, message: 'Please provide Roll No / Enrollment No / Email and password.' });
  }

  const db = readDb();
  const cleanId = identifier.trim().toLowerCase();

  const user = db.users.find(u => 
    u.roll_no.toLowerCase() === cleanId ||
    u.enrollment_no.toLowerCase() === cleanId ||
    u.email.toLowerCase() === cleanId
  );

  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials. User not found in CE-A registry.' });
  }

  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Incorrect password. (Default password is: ldrp123)' });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role, roll_no: user.roll_no },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  const { password: _, ...safeUser } = user;

  // If user has group_id, attach group info
  let groupInfo = null;
  if (user.group_id) {
    groupInfo = db.groups.find(g => g.id === user.group_id);
  }
  let coordGroupInfo = null;
  if (user.coord_group_id) {
    coordGroupInfo = db.groups.find(g => g.id === user.coord_group_id);
  }

  return res.json({
    success: true,
    message: `Welcome back, ${user.full_name}!`,
    token,
    user: {
      ...safeUser,
      group: groupInfo,
      coord_group: coordGroupInfo
    }
  });
});

// GET /api/auth/demo-accounts
router.get('/demo-accounts', (req, res) => {
  const db = readDb();
  const demoProfiles = [
    {
      label: "Class Coordinator (CR)",
      name: "Priyanshu Bharadava",
      role: "CLASS_COORD",
      roll_no: "20",
      enrollment_no: "25BECE30020",
      description: "Class Leader & Coordinator (Roll No. 20)",
      badgeColor: "bg-blue-100 text-blue-800 border-blue-300"
    },
    {
      label: "Class Mentor (Faculty)",
      name: "Dr. Hitsh Barot",
      role: "MENTOR",
      roll_no: "FAC-02",
      enrollment_no: "LDRP-FAC-002",
      description: "Associate Professor & CE-A Mentor",
      badgeColor: "bg-purple-100 text-purple-800 border-purple-300"
    },
    {
      label: "Class Mentor (Faculty)",
      name: "Prof. Avani Patel",
      role: "MENTOR",
      roll_no: "FAC-01",
      enrollment_no: "LDRP-FAC-001",
      description: "Assistant Professor & CE-A Mentor",
      badgeColor: "bg-purple-100 text-purple-800 border-purple-300"
    },
    {
      label: "Group 2 Coordinator",
      name: "Kavya Barot",
      role: "GROUP_COORD",
      roll_no: "15",
      enrollment_no: "25BECE30015",
      description: "Manages Roll No. 11 - 20 (Group 2)",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-300"
    },
    {
      label: "Group 1 Coordinator",
      name: "Vyom Bhatt",
      role: "GROUP_COORD",
      roll_no: "25",
      enrollment_no: "25BECE30025",
      description: "Manages Roll No. 1 - 10 (Group 1)",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300"
    },
    {
      label: "Group 8 (D2D) Coordinator",
      name: "Nemish Ruparel",
      role: "GROUP_COORD",
      roll_no: "D2D-CE-03",
      enrollment_no: "25BED2D3003",
      description: "Manages D2D Lateral Students (Group 8)",
      badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-300"
    },
    {
      label: "Regular Student",
      name: "Aal Anand L.",
      role: "STUDENT",
      roll_no: "1",
      enrollment_no: "25BECE30001",
      description: "Group 1 Member (Roll No. 1)",
      badgeColor: "bg-slate-100 text-slate-800 border-slate-300"
    }
  ];

  res.json({ success: true, demoProfiles, defaultPassword: "ldrp123" });
});

// GET /api/auth/me
router.get('/me', authenticateToken, (req, res) => {
  const db = readDb();
  let groupInfo = null;
  if (req.user.group_id) {
    groupInfo = db.groups.find(g => g.id === req.user.group_id);
  }
  let coordGroupInfo = null;
  if (req.user.coord_group_id) {
    coordGroupInfo = db.groups.find(g => g.id === req.user.coord_group_id);
  }

  res.json({
    success: true,
    user: {
      ...req.user,
      group: groupInfo,
      coord_group: coordGroupInfo
    }
  });
});

// POST /api/auth/change-password
router.post('/change-password', authenticateToken, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, message: 'Please provide current and new password.' });
  }

  const db = readDb();
  const userIdx = db.users.findIndex(u => u.id === req.user.id);
  if (userIdx === -1) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  const isMatch = bcrypt.compareSync(currentPassword, db.users[userIdx].password);
  if (!isMatch) {
    return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
  }

  const salt = bcrypt.genSaltSync(10);
  db.users[userIdx].password = bcrypt.hashSync(newPassword, salt);
  writeDb(db);

  res.json({ success: true, message: 'Password updated successfully!' });
});

module.exports = router;
