/**
 * TechnoX Society - Team API Routes
 * Serves team member data from team.json.
 */

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const DATA_PATH = path.join(__dirname, '../data/team.json');

// Helper: read team from JSON file
function readTeam() {
  const raw = fs.readFileSync(DATA_PATH, 'utf-8');
  return JSON.parse(raw);
}

// GET /api/team - return all team members
router.get('/', (req, res) => {
  try {
    const team = readTeam();
    res.json({ success: true, count: team.length, data: team });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to load team data.' });
  }
});

module.exports = router;
