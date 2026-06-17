const express = require('express');
const router = express.Router();
const data = require('../data/portfolio.json');

// GET /api/profile
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: {
      ...data.profile,
      skills: data.skills,
      navigation: data.navigation,
      footer: data.footer
    }
  });
});

// GET /api/profile/skills
router.get('/skills', (req, res) => {
  res.json({ success: true, data: data.skills });
});

module.exports = router;
