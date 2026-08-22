const jwt = require('jsonwebtoken');
const { readDb } = require('../data/db');

const JWT_SECRET = process.env.JWT_SECRET || 'ldrp-cea-super-secure-token-secret-2026-key';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required. Please login.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid or expired session token.' });
    }

    const db = readDb();
    const user = db.users.find(u => u.id === decoded.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User account not found.' });
    }

    // Attach user without password
    const { password, ...safeUser } = user;
    req.user = safeUser;
    next();
  });
}

function requireRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: This action requires one of [${allowedRoles.join(', ')}] permissions.`
      });
    }

    next();
  };
}

module.exports = {
  JWT_SECRET,
  authenticateToken,
  requireRoles
};
