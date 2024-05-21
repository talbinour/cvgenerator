const express = require('express');
const router = express.Router();
const Job = require('./Job');
router.post('/api/jobs', async (req, res) => {
    try {
      const jobs = req.body;
      await Job.insertMany(jobs);
      res.status(201).send('Jobs saved successfully');
    } catch (error) {
      res.status(500).send('Error saving jobs');
    }
  });
router.get('/api/jobs/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const jobs = await Job.find({ userId });
      res.status(200).json(jobs);
    } catch (error) {
      res.status(500).send('Error fetching jobs');
    }
  });
module.exports = router;