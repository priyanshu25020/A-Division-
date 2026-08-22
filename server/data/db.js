const fs = require('fs');
const path = require('path');

const dbFile = path.join(__dirname, 'db.json');

// In-memory fallback if filesystem is read-only (Vercel Serverless)
let inMemoryDb = null;

function getInitialDb() {
  try {
    if (fs.existsSync(dbFile)) {
      const raw = fs.readFileSync(dbFile, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Could not read db.json from disk, using fallback', e);
  }
  return { users: [], groups: [], forms: [], submissions: [], announcements: [], leaves: [], subjects: [], timetable: [] };
}

function readDb() {
  if (inMemoryDb) {
    return inMemoryDb;
  }
  inMemoryDb = getInitialDb();
  return inMemoryDb;
}

function writeDb(data) {
  try {
    data.last_updated = new Date().toISOString();
    inMemoryDb = data;
    // Attempt disk write only if not in read-only environment
    try {
      fs.writeFileSync(dbFile, JSON.stringify(data, null, 2), 'utf-8');
    } catch (writeErr) {
      // On Vercel serverless, disk is read-only, inMemoryDb will handle the session safely!
    }
    return true;
  } catch (err) {
    console.error('Error in writeDb:', err);
    return false;
  }
}

module.exports = {
  readDb,
  writeDb
};