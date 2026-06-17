const express = require('express');
const router = express.Router();
const data = require('../data/portfolio.json');

// GET /api/organizations
router.get('/', (req, res) => {
  res.json({ success: true, count: data.organizations.length, data: data.organizations });
});

// GET /api/organizations/:id
router.get('/:id', (req, res) => {
  const item = data.organizations.find(o => o.id === parseInt(req.params.id));
  if (!item) {
    return res.status(404).json({ success: false, message: 'Organization record not found' });
  }
  res.json({ success: true, data: item });
});

module.exports = router;
