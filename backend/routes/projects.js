const express = require('express');
const router = express.Router();
const data = require('../data/portfolio.json');

// GET /api/projects
router.get('/', (req, res) => {
  const { limit, year } = req.query;
  let projects = [...data.projects];

  if (year) {
    projects = projects.filter(p => p.year === year);
  }

  if (limit) {
    projects = projects.slice(0, parseInt(limit));
  }

  res.json({ success: true, count: projects.length, data: projects });
});

// GET /api/projects/:id
router.get('/:id', (req, res) => {
  const project = data.projects.find(p => p.id === parseInt(req.params.id));
  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }
  res.json({ success: true, data: project });
});

module.exports = router;
