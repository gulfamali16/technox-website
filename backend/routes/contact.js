/**
 * TechnoX Society - Contact API Routes
 * Validates and logs contact form submissions.
 */

const express = require('express');
const router = express.Router();

// Simple email regex validator
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// POST /api/contact - validate and log a contact form submission
router.post('/', (req, res) => {
  const { name, email, subject, message } = req.body;
  const errors = [];

  // Validation
  if (!name || name.trim().length === 0) {
    errors.push('Name is required.');
  }

  if (!email || !isValidEmail(email.trim())) {
    errors.push('A valid email address is required.');
  }

  if (!message || message.trim().length < 10) {
    errors.push('Message must be at least 10 characters long.');
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  // Log the submission to stdout.
  // TODO (production): replace/extend this with a database write or email notification
  // e.g., using nodemailer to send to drumarrashidcui@gmail.com, or a MongoDB insert.
  console.log('[Contact Form Submission]', {
    name: name.trim(),
    email: email.trim(),
    subject: subject ? subject.trim() : '(no subject)',
    message: message.trim(),
    timestamp: new Date().toISOString(),
  });

  res.json({
    success: true,
    message: "Thank you for reaching out! We'll get back to you soon.",
  });
});

module.exports = router;
