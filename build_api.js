const fs = require('fs');
const path = require('path');

const dbData = fs.readFileSync(path.join(__dirname, 'server/data/db.json'), 'utf8');

const code = `const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'ldrp-cea-super-secure-token-secret-2026-key';

let db = ` + dbData + `;

app.use(helmet({ crossOriginResourcePolicy: false, contentSecurityPolicy: false }));
app.use(cors({ origin: true, credentials: true }));
app.options('*', cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Access token required.' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ success: false, message: 'Invalid token.' });
    const user = db.users.find(u => u.id === decoded.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    const { password, ...safeUser } = user;
    req.user = safeUser;
    next();
  });
}

app.get(['/api/health', '/health'], (req, res) => res.json({ status: 'healthy', version: '1.0.0', serverless: true }));

app.get(['/api/auth/demo-accounts', '/auth/demo-accounts'], (req, res) => {
  const demoProfiles = [
    { label: 'Class Coordinator (CR)', name: 'Priyanshu Bharadava', role: 'CLASS_COORD', roll_no: '20', enrollment_no: '25BECE30020' },
    { label: 'Class Mentor (Faculty)', name: 'Dr. Hitsh Barot', role: 'MENTOR', roll_no: 'FAC-02', enrollment_no: 'LDRP-FAC-002' },
    { label: 'Class Mentor (Faculty)', name: 'Prof. Avani Patel', role: 'MENTOR', roll_no: 'FAC-01', enrollment_no: 'LDRP-FAC-001' },
    { label: 'Group 2 Coordinator', name: 'Kavya Barot', role: 'GROUP_COORD', roll_no: '15', enrollment_no: '25BECE30015' },
    { label: 'Group 1 Coordinator', name: 'Vyom Bhatt', role: 'GROUP_COORD', roll_no: '25', enrollment_no: '25BECE30025' },
    { label: 'Group 8 (D2D) Coordinator', name: 'Nemish Ruparel', role: 'GROUP_COORD', roll_no: 'D2D-CE-03', enrollment_no: '25BED2D3003' },
    { label: 'Regular Student', name: 'Aal Anand L.', role: 'STUDENT', roll_no: '1', enrollment_no: '25BECE30001' }
  ];
  res.json({ success: true, demoProfiles, defaultPassword: 'ldrp123' });
});

app.post(['/api/auth/login', '/auth/login'], (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) {
    return res.status(400).json({ success: false, message: 'Please provide ID and password.' });
  }

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
    return res.status(401).json({ success: false, message: 'Incorrect password. (Default is ldrp123)' });
  }

  const token = jwt.sign({ id: user.id, role: user.role, roll_no: user.roll_no }, JWT_SECRET, { expiresIn: '7d' });
  const { password: _, ...safeUser } = user;
  const groupInfo = user.group_id ? db.groups.find(g => g.id === user.group_id) : null;
  const coordGroupInfo = user.coord_group_id ? db.groups.find(g => g.id === user.coord_group_id) : null;

  return res.json({
    success: true,
    message: 'Welcome back, ' + user.full_name + '!',
    token,
    user: Object.assign({}, safeUser, { group: groupInfo, coord_group: coordGroupInfo })
  });
});

app.get(['/api/auth/me', '/auth/me'], authenticateToken, (req, res) => {
  const groupInfo = req.user.group_id ? db.groups.find(g => g.id === req.user.group_id) : null;
  const coordGroupInfo = req.user.coord_group_id ? db.groups.find(g => g.id === req.user.coord_group_id) : null;
  res.json({ success: true, user: Object.assign({}, req.user, { group: groupInfo, coord_group: coordGroupInfo }) });
});

app.get(['/api/students', '/students'], authenticateToken, (req, res) => {
  const { group, search, role } = req.query;
  let students = db.users.filter(u => u.role !== 'MENTOR').map(u => {
    const { password, ...safe } = u;
    const groupInfo = db.groups.find(g => g.id === u.group_id);
    return Object.assign({}, safe, { group_name: groupInfo ? groupInfo.name : 'Unassigned', group_number: groupInfo ? groupInfo.group_number : null });
  });

  if (group) students = students.filter(s => s.group_id === parseInt(group));
  if (role) students = students.filter(s => s.role === role);
  if (search) {
    const q = search.toLowerCase().trim();
    students = students.filter(s => s.full_name.toLowerCase().includes(q) || s.roll_no.toLowerCase().includes(q) || s.enrollment_no.toLowerCase().includes(q));
  }
  res.json({ success: true, total: students.length, students });
});

app.get(['/api/students/groups', '/students/groups'], authenticateToken, (req, res) => {
  const groups = db.groups.map(g => {
    const members = db.users.filter(u => u.group_id === g.id && u.role !== 'MENTOR');
    return Object.assign({}, g, {
      member_count: members.length,
      average_attendance: 89,
      members: members.map(m => ({ id: m.id, roll_no: m.roll_no, enrollment_no: m.enrollment_no, full_name: m.full_name, phone: m.phone, attendance_pct: m.attendance_pct }))
    });
  });
  res.json({ success: true, groups });
});

app.get(['/api/forms', '/forms'], authenticateToken, (req, res) => {
  const forms = db.forms.map(form => {
    const totalSubmissions = db.submissions.filter(s => s.form_id === form.id);
    const userSubmission = totalSubmissions.find(s => s.student_id === req.user.id);
    const totalTarget = db.users.filter(u => u.role !== 'MENTOR').length;
    return Object.assign({}, form, {
      total_submissions: totalSubmissions.length,
      total_target: totalTarget,
      completion_rate: Math.round((totalSubmissions.length / totalTarget) * 100) || 0,
      user_submission: userSubmission || null,
      is_submitted_by_user: Boolean(userSubmission)
    });
  });
  res.json({ success: true, forms });
});

app.get(['/api/forms/:id', '/forms/:id'], authenticateToken, (req, res) => {
  const form = db.forms.find(f => f.id === req.params.id);
  if (!form) return res.status(404).json({ success: false, message: 'Form not found.' });

  const submissions = db.submissions.filter(s => s.form_id === form.id);
  const totalStudents = db.users.filter(u => u.role !== 'MENTOR');
  const groupStats = db.groups.map(g => {
    const groupStudents = db.users.filter(u => u.group_id === g.id && u.role !== 'MENTOR');
    const groupSubs = submissions.filter(s => s.group_id === g.id);
    return {
      group_id: g.id,
      group_name: g.name,
      coordinator_name: g.coordinator_name,
      total_students: groupStudents.length,
      submitted_count: groupSubs.length,
      pending_count: groupStudents.length - groupSubs.length,
      completion_pct: groupStudents.length > 0 ? Math.round((groupSubs.length / groupStudents.length) * 100) : 0,
      is_complete: groupSubs.length === groupStudents.length
    };
  });

  res.json({
    success: true,
    form,
    stats: { total_students: totalStudents.length, submitted_count: submissions.length, pending_count: totalStudents.length - submissions.length, completion_rate: Math.round((submissions.length / totalStudents.length) * 100) },
    groupStats,
    user_submission: submissions.find(s => s.student_id === req.user.id) || null,
    submissions: req.user.role === 'STUDENT' ? undefined : submissions
  });
});

app.post(['/api/forms/:id/submit', '/forms/:id/submit'], authenticateToken, (req, res) => {
  const form = db.forms.find(f => f.id === req.params.id);
  if (!form) return res.status(404).json({ success: false, message: 'Form not found.' });

  let responseData = req.body.response_data || req.body;
  if (typeof responseData === 'string') {
    try { responseData = JSON.parse(responseData); } catch (e) {}
  }

  const existingIdx = db.submissions.findIndex(s => s.form_id === form.id && s.student_id === req.user.id);
  const record = {
    id: existingIdx >= 0 ? db.submissions[existingIdx].id : 'sub-' + Date.now(),
    form_id: form.id,
    student_id: req.user.id,
    student_name: req.user.full_name,
    roll_no: req.user.roll_no,
    enrollment_no: req.user.enrollment_no,
    group_id: req.user.group_id,
    response_data: responseData,
    status: 'VERIFIED',
    submitted_at: new Date().toISOString()
  };

  if (existingIdx >= 0) db.submissions[existingIdx] = record;
  else db.submissions.push(record);

  res.json({ success: true, message: 'Submission recorded successfully!', submission: record });
});

app.get(['/api/forms/:id/nudge-list', '/forms/:id/nudge-list'], authenticateToken, (req, res) => {
  const form = db.forms.find(f => f.id === req.params.id);
  if (!form) return res.status(404).json({ success: false, message: 'Form not found.' });

  const submissions = db.submissions.filter(s => s.form_id === form.id);
  const submittedIds = new Set(submissions.map(s => s.student_id));
  const targetStudents = db.users.filter(u => u.role !== 'MENTOR' && !submittedIds.has(u.id));

  const nudgeList = targetStudents.map(student => {
    const groupInfo = db.groups.find(g => g.id === student.group_id);
    const msg = 'Hello ' + student.full_name + ' (Roll No. ' + student.roll_no + '), your submission for \"' + form.title + '\" is PENDING on CE-A Portal.';
    return {
      student_id: student.id,
      roll_no: student.roll_no,
      enrollment_no: student.enrollment_no,
      full_name: student.full_name,
      phone: student.phone,
      group_name: groupInfo ? groupInfo.name : 'Group',
      coordinator_name: groupInfo ? groupInfo.coordinator_name : 'Coordinator',
      whatsapp_link: 'https://wa.me/91' + (student.phone || '9879000000') + '?text=' + encodeURIComponent(msg),
      raw_message: msg
    };
  });

  res.json({ success: true, form_title: form.title, total_pending: nudgeList.length, nudge_list: nudgeList });
});

app.get(['/api/holidays/active-poll', '/holidays/active-poll'], authenticateToken, (req, res) => {
  const holidayForm = db.forms.find(f => f.form_type === 'HOLIDAY_DECLARATION' && f.is_active);
  if (!holidayForm) return res.json({ success: true, poll: null });

  const submissions = db.submissions.filter(s => s.form_id === holidayForm.id);
  const totalStudents = db.users.filter(u => u.role !== 'MENTOR');
  const userSub = submissions.find(s => s.student_id === req.user.id);

  let attending = 0, absent = 0, commuting = 0;
  submissions.forEach(s => {
    const val = (s.response_data && s.response_data.q1) || '';
    if (val.includes('Present') || val.includes('attend')) attending++;
    else if (val.includes('absent') || val.includes('Absent')) absent++;
    else commuting++;
  });

  const groupBreakdown = db.groups.map(g => {
    const members = db.users.filter(u => u.group_id === g.id && u.role !== 'MENTOR');
    const subs = submissions.filter(s => s.group_id === g.id);
    return { group_id: g.id, group_name: g.name, coordinator_name: g.coordinator_name, total: members.length, submitted: subs.length, is_complete: subs.length === members.length };
  });

  res.json({
    success: true,
    poll: Object.assign({}, holidayForm, {
      radar: {
        total_students: totalStudents.length,
        submitted: submissions.length,
        pending: totalStudents.length - submissions.length,
        attending, absent, commuting,
        attendance_rate: Math.round((attending / (submissions.length || 1)) * 100),
        completion_rate: Math.round((submissions.length / totalStudents.length) * 100)
      },
      group_breakdown: groupBreakdown,
      user_response: userSub ? userSub.response_data : null
    })
  });
});

app.post(['/api/holidays/vote', '/holidays/vote'], authenticateToken, (req, res) => {
  const { form_id, choice, reason } = req.body;
  const form = db.forms.find(f => f.id === form_id || (f.form_type === 'HOLIDAY_DECLARATION' && f.is_active));
  if (!form) return res.status(404).json({ success: false, message: 'Holiday form not found.' });

  const existingIdx = db.submissions.findIndex(s => s.form_id === form.id && s.student_id === req.user.id);
  const record = {
    id: existingIdx >= 0 ? db.submissions[existingIdx].id : 'sub-' + Date.now(),
    form_id: form.id,
    student_id: req.user.id,
    student_name: req.user.full_name,
    roll_no: req.user.roll_no,
    enrollment_no: req.user.enrollment_no,
    group_id: req.user.group_id,
    response_data: { q1: choice, q2: reason || '' },
    status: 'VERIFIED',
    submitted_at: new Date().toISOString()
  };

  if (existingIdx >= 0) db.submissions[existingIdx] = record;
  else db.submissions.push(record);

  res.json({ success: true, message: 'Vote recorded!', vote: record });
});

app.get(['/api/announcements', '/announcements'], authenticateToken, (req, res) => {
  const list = db.announcements || [];
  const urgentAlert = list.find(a => a.priority === 'URGENT');
  res.json({ success: true, urgent_alert: urgentAlert || null, announcements: list });
});

app.post(['/api/announcements', '/announcements'], authenticateToken, (req, res) => {
  const { title, content, priority, target_group } = req.body;
  const newAnn = {
    id: 'ann-' + Date.now(),
    title, content,
    priority: priority || 'NORMAL',
    posted_by_name: req.user.full_name,
    posted_by_role: req.user.role,
    target_group: target_group ? parseInt(target_group) : null,
    created_at: new Date().toISOString()
  };
  db.announcements.unshift(newAnn);
  res.json({ success: true, message: 'Notice broadcasted!', announcement: newAnn });
});

app.get(['/api/academics/subjects', '/academics/subjects'], authenticateToken, (req, res) => {
  res.json({ success: true, subjects: db.subjects || [] });
});

app.get(['/api/academics/timetable', '/academics/timetable'], authenticateToken, (req, res) => {
  res.json({ success: true, timetable: db.timetable || [] });
});

app.get(['/api/leaves', '/leaves'], authenticateToken, (req, res) => {
  res.json({ success: true, leaves: db.leaves || [] });
});

app.post(['/api/leaves/apply', '/leaves/apply'], authenticateToken, (req, res) => {
  const { from_date, to_date, reason } = req.body;
  const newLeave = {
    id: 'leave-' + Date.now(),
    student_id: req.user.id,
    student_name: req.user.full_name,
    roll_no: req.user.roll_no,
    group_id: req.user.group_id,
    from_date, to_date, reason,
    coordinator_status: 'PENDING',
    mentor_status: 'PENDING',
    applied_at: new Date().toISOString()
  };
  db.leaves.unshift(newLeave);
  res.json({ success: true, message: 'Leave submitted!', leave: newLeave });
});

app.get(['/api/analytics/overview', '/analytics/overview'], authenticateToken, (req, res) => {
  const students = db.users.filter(u => u.role !== 'MENTOR');
  const groupLeaderboard = db.groups.map((g, idx) => {
    const members = students.filter(s => s.group_id === g.id);
    const formSubs = db.submissions.filter(s => s.group_id === g.id);
    return {
      group_id: g.id,
      group_name: g.name,
      badge: g.badge,
      color: g.color,
      coordinator_name: g.coordinator_name,
      total_students: members.length,
      submitted: formSubs.length,
      pending: Math.max(0, members.length - formSubs.length),
      completion_pct: members.length > 0 ? Math.min(100, Math.round((formSubs.length / members.length) * 100)) : 0,
      rank: idx + 1
    };
  });

  res.json({
    success: true,
    metrics: {
      total_students: students.length,
      total_groups: db.groups.length,
      active_forms: db.forms.length,
      total_submissions: db.submissions.length,
      average_attendance: 89
    },
    groupLeaderboard
  });
});

app.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'LDRP-ITR CE-A Class Command Center API is 100% LIVE and Running on Vercel!',
    timestamp: new Date().toISOString()
  });
});

module.exports = app;
`;

fs.writeFileSync(path.join(__dirname, 'api/index.js'), code, 'utf8');
fs.writeFileSync(path.join(__dirname, 'server/api/index.js'), code, 'utf8');
fs.writeFileSync(path.join(__dirname, 'server/index.js'), code, 'utf8');
console.log('API generated without any errors.');