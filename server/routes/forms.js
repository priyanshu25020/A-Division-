const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { readDb, writeDb } = require('../data/db');
const { authenticateToken, requireRoles } = require('../middleware/security');

// Configure multer for file uploads
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `file_${Date.now()}_${Math.round(Math.random() * 1E9)}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// GET /api/forms (List all active and past forms with user specific status)
router.get('/', authenticateToken, (req, res) => {
  const db = readDb();
  const forms = db.forms.map(form => {
    const totalSubmissions = db.submissions.filter(s => s.form_id === form.id);
    const userSubmission = totalSubmissions.find(s => s.student_id === req.user.id);
    const totalTarget = db.users.filter(u => u.role !== 'MENTOR').length;

    return {
      ...form,
      total_submissions: totalSubmissions.length,
      total_target: totalTarget,
      completion_rate: Math.round((totalSubmissions.length / totalTarget) * 100) || 0,
      user_submission: userSubmission || null,
      is_submitted_by_user: !!userSubmission
    };
  });

  res.json({ success: true, forms });
});

// GET /api/forms/:id (Get single form with submission stats)
router.get('/:id', authenticateToken, (req, res) => {
  const db = readDb();
  const form = db.forms.find(f => f.id === req.params.id);

  if (!form) {
    return res.status(404).json({ success: false, message: 'Form not found.' });
  }

  const submissions = db.submissions.filter(s => s.form_id === form.id);
  const totalStudents = db.users.filter(u => u.role !== 'MENTOR');

  // Calculate group-wise progress
  const groupStats = db.groups.map(g => {
    const groupStudents = db.users.filter(u => u.group_id === g.id && u.role !== 'MENTOR');
    const groupSubmissions = submissions.filter(s => s.group_id === g.id);
    const pendingCount = groupStudents.length - groupSubmissions.length;

    return {
      group_id: g.id,
      group_number: g.group_number,
      group_name: g.name,
      coordinator_name: g.coordinator_name,
      total_students: groupStudents.length,
      submitted_count: groupSubmissions.length,
      pending_count: pendingCount,
      completion_pct: groupStudents.length > 0 ? Math.round((groupSubmissions.length / groupStudents.length) * 100) : 0,
      is_complete: groupSubmissions.length === groupStudents.length
    };
  });

  const userSubmission = submissions.find(s => s.student_id === req.user.id);

  res.json({
    success: true,
    form,
    stats: {
      total_students: totalStudents.length,
      submitted_count: submissions.length,
      pending_count: totalStudents.length - submissions.length,
      completion_rate: Math.round((submissions.length / totalStudents.length) * 100)
    },
    groupStats,
    user_submission: userSubmission || null,
    submissions: req.user.role === 'STUDENT' ? undefined : submissions
  });
});

// POST /api/forms (Create new form - Mentors & Class Coordinator only)
router.post('/', authenticateToken, requireRoles('MENTOR', 'CLASS_COORD'), (req, res) => {
  const { title, description, form_type, deadline, requires_file, questions } = req.body;

  if (!title || !deadline) {
    return res.status(400).json({ success: false, message: 'Form title and deadline are required.' });
  }

  const db = readDb();
  const newForm = {
    id: `form-${Date.now()}`,
    title,
    description: description || '',
    form_type: form_type || 'GENERAL_SURVEY',
    deadline,
    created_by: req.user.id,
    created_by_name: `${req.user.full_name} (${req.user.role === 'MENTOR' ? 'Mentor' : 'CR'})`,
    is_active: true,
    requires_file: !!requires_file,
    questions: questions || [
      { id: 'q1', label: 'Declaration Response', type: 'text', required: true }
    ],
    created_at: new Date().toISOString()
  };

  db.forms.unshift(newForm);

  // Auto-post an announcement for this new form!
  db.announcements.unshift({
    id: `ann-${Date.now()}`,
    title: `📋 New Form: ${newForm.title}`,
    content: `A new form has been assigned to all CE-A students. Deadline: ${new Date(deadline).toLocaleString('en-IN')}. Please submit your response promptly.`,
    priority: "IMPORTANT",
    posted_by_name: req.user.full_name,
    posted_by_role: req.user.role === 'MENTOR' ? 'Mentor' : 'Class Coordinator',
    target_group: null,
    created_at: new Date().toISOString()
  });

  writeDb(db);
  res.json({ success: true, message: 'Form published successfully and announcement broadcasted!', form: newForm });
});

// POST /api/forms/:id/submit (Submit form responses with optional file)
router.post('/:id/submit', authenticateToken, upload.single('attachment'), (req, res) => {
  const db = readDb();
  const form = db.forms.find(f => f.id === req.params.id);

  if (!form) {
    return res.status(404).json({ success: false, message: 'Form not found.' });
  }

  // Check deadline
  if (new Date() > new Date(form.deadline)) {
    return res.status(400).json({ success: false, message: 'Form submission deadline has passed.' });
  }

  let responseData = {};
  try {
    responseData = typeof req.body.response_data === 'string' 
      ? JSON.parse(req.body.response_data) 
      : req.body.response_data || req.body;
  } catch (e) {
    responseData = req.body;
  }

  const existingIdx = db.submissions.findIndex(s => s.form_id === form.id && s.student_id === req.user.id);
  const attachmentUrl = req.file ? `/uploads/${req.file.filename}` : null;

  const submissionRecord = {
    id: existingIdx >= 0 ? db.submissions[existingIdx].id : `sub-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    form_id: form.id,
    student_id: req.user.id,
    student_name: req.user.full_name,
    roll_no: req.user.roll_no,
    enrollment_no: req.user.enrollment_no,
    group_id: req.user.group_id,
    response_data: responseData,
    attachment_url: attachmentUrl || (existingIdx >= 0 ? db.submissions[existingIdx].attachment_url : null),
    status: "VERIFIED",
    submitted_at: new Date().toISOString()
  };

  if (existingIdx >= 0) {
    db.submissions[existingIdx] = submissionRecord;
  } else {
    db.submissions.push(submissionRecord);
  }

  writeDb(db);
  res.json({ success: true, message: 'Your response has been recorded successfully!', submission: submissionRecord });
});

// GET /api/forms/:id/nudge-list (Get pending students with preformatted WhatsApp nudge links)
router.get('/:id/nudge-list', authenticateToken, (req, res) => {
  const db = readDb();
  const form = db.forms.find(f => f.id === req.params.id);

  if (!form) {
    return res.status(404).json({ success: false, message: 'Form not found.' });
  }

  const submissions = db.submissions.filter(s => s.form_id === form.id);
  const submittedStudentIds = new Set(submissions.map(s => s.student_id));

  let targetStudents = db.users.filter(u => u.role !== 'MENTOR' && !submittedStudentIds.has(u.id));

  // If requester is a Group Coordinator, limit to their group
  if (req.user.role === 'GROUP_COORD' && req.user.coord_group_id) {
    targetStudents = targetStudents.filter(u => u.group_id === req.user.coord_group_id);
  }

  const deadlineFormatted = new Date(form.deadline).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
  });

  const nudgeList = targetStudents.map(student => {
    const groupInfo = db.groups.find(g => g.id === student.group_id);
    const message = `Hello ${student.full_name} (Roll No. ${student.roll_no}),\n\nYour submission for "${form.title}" is currently PENDING on the CE-A Portal.\n\n⚠️ Deadline: ${deadlineFormatted}\n\nPlease submit your declaration right away:\nhttps://ldrp-cea.edu.in/forms/${form.id}\n\n- CE-A Coordinator Team`;

    const encodedMsg = encodeURIComponent(message);
    const phoneNum = student.phone || "919876543210";
    const waLink = `https://wa.me/91${phoneNum}?text=${encodedMsg}`;

    return {
      student_id: student.id,
      roll_no: student.roll_no,
      enrollment_no: student.enrollment_no,
      full_name: student.full_name,
      phone: student.phone,
      group_id: student.group_id,
      group_name: groupInfo ? groupInfo.name : 'Group',
      coordinator_name: groupInfo ? groupInfo.coordinator_name : 'Coordinator',
      whatsapp_link: waLink,
      raw_message: message
    };
  });

  res.json({
    success: true,
    form_title: form.title,
    deadline: form.deadline,
    total_pending: nudgeList.length,
    nudge_list: nudgeList
  });
});

// PATCH /api/forms/submission/:id/status (Approve / Verify / Reject submission)
router.patch('/submission/:id/status', authenticateToken, requireRoles('MENTOR', 'CLASS_COORD', 'GROUP_COORD'), (req, res) => {
  const { status, remark } = req.body;
  const db = readDb();
  const subIdx = db.submissions.findIndex(s => s.id === req.params.id);

  if (subIdx === -1) {
    return res.status(404).json({ success: false, message: 'Submission record not found.' });
  }

  db.submissions[subIdx].status = status || db.submissions[subIdx].status;
  if (remark) {
    db.submissions[subIdx].remark = remark;
  }
  db.submissions[subIdx].reviewed_by = req.user.full_name;
  db.submissions[subIdx].reviewed_at = new Date().toISOString();

  writeDb(db);
  res.json({ success: true, message: `Submission marked as ${status}.`, submission: db.submissions[subIdx] });
});

module.exports = router;
