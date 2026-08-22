const fs = require('fs');
const path = require('path');

const dbFile = path.join(__dirname, 'db.json');

function readDb() {
  try {
    const raw = fs.readFileSync(dbFile, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading db.json:', err);
    return { users: [], groups: [], forms: [], submissions: [], announcements: [], leaves: [], subjects: [], timetable: [] };
  }
}

function writeDb(data) {
  try {
    data.last_updated = new Date().toISOString();
    fs.writeFileSync(dbFile, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing db.json:', err);
    return false;
  }
}

module.exports = {
  readDb,
  writeDb
};
