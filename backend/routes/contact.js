const express = require('express');
const router = express.Router();

const validateContact = (body) => {
  const errors = [];
  const { name, email, message } = body;

  if (!name || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Valid email is required');
  }
  if (!message || message.trim().length < 10) {
    errors.push('Message must be at least 10 characters');
  }

  return errors;
};

// POST /api/contact
router.post('/', (req, res) => {
  const { name, email, subject, message } = req.body;

  const errors = validateContact(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  // In production, use nodemailer or a service like Resend/SendGrid
  // For now we log and confirm receipt
  console.log(`[CONTACT] New message from ${name} <${email}>`);
  console.log(`[CONTACT] Subject: ${subject || '(none)'}`);
  console.log(`[CONTACT] Message: ${message}`);

  res.status(201).json({
    success: true,
    message: 'Your message has been received! I will get back to you soon.',
    data: { name, email, subject: subject || '', receivedAt: new Date().toISOString() }
  });
});

module.exports = router;
