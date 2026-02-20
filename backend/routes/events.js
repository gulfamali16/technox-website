/**
 * TechnoX Society - Events API Routes
 * Serves event data from events.json with optional type filtering.
 */

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const DATA_PATH = path.join(__dirname, '../data/events.json');

// Helper: read events from JSON file
function readEvents() {
  const raw = fs.readFileSync(DATA_PATH, 'utf-8');
  return JSON.parse(raw);
}

// GET /api/events - return all events, optional ?type= filter
router.get('/', (req, res) => {
  try {
    let events = readEvents();
    const { type } = req.query;

    if (type && ['workshop', 'seminar', 'competition'].includes(type)) {
      events = events.filter((e) => e.type === type);
    }

    res.json({ success: true, count: events.length, data: events });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to load events.' });
  }
});

// GET /api/events/:id - return single event by id
router.get('/:id', (req, res) => {
  try {
    const events = readEvents();
    const event = events.find((e) => e.id === parseInt(req.params.id, 10));

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    res.json({ success: true, data: event });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to load event.' });
  }
});

module.exports = router;
