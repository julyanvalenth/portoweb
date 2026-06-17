const express = require('express');
const router = express.Router();
const data = require('../data/portfolio.json');

// GET /api/education
router.get('/', (req, res) => {
  res.json({ success: true, count: data.education.length, data: data.education });
});

// GET /api/education/:id
router.get('/:id', (req, res) => {
  const item = data.education.find(e => e.id === parseInt(req.params.id));
  if (!item) {
    return res.status(404).json({ success: false, message: 'Education record not found' });
  }
  res.json({ success: true, data: item });
});

module.exports = router;
