const express = require('express');
const router = express.Router();
const { Lead } = require('../models');

router.get('/leads', async (req, res) => {
  const { startDate, endDate } = req.query;
  
  const where = {};
  
  if (startDate && endDate) {
    where.created_at = {
      [Op.between]: [new Date(startDate), new Date(endDate)]
    };
  }

  try {
    const leads = await Lead.findAll({ where });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
