const express = require('express');
const router = express.Router();
const Student = require('../models/studentModel');

router.get('/', async (req, res) => {
  try {
    const grades = await Student.distinct('grade');
    res.json({ grades });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch grades' });
  }
});

module.exports = router;
