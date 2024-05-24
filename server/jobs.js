const express = require('express');
const router = express.Router();
const Job = require('./Job');
const moment = require('moment');
const nodemailer = require('nodemailer');
const formatDate = (dateString) => {
  return moment(dateString, 'YYYY-MM-DDTHH:mm:ss').format('DD MMMM YYYY');
};


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'verif.cevor@gmail.com',
      pass: 'bslf cnyx hudg sllz',
    },
  });
  router.post('/sendfavoritejob/:email', async (req, res) => {
    const { email, selectedJob } = req.body;
  
    if (!email || !selectedJob) {
      return res.status(400).json({ status: 400, message: "Email and selected job are required" });
    }
  
    try {
      // Vous pouvez également vérifier si l'utilisateur existe ici et effectuer d'autres validations si nécessaire
  
      // Options du courrier électronique
      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Votre emploi favori sélectionné",
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
            <h2 style="color: #1f4172;">Votre emploi favori sélectionné</h2>
            <div style="background-color: white; padding: 20px; border-radius: 5px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
              <p style="font-size: 18px;"><strong>Titre:</strong> ${selectedJob.title}</p>
              <p style="font-size: 18px;"><strong>Entreprise:</strong> ${selectedJob.company}</p>
              <p style="font-size: 18px;"><strong>Lieu:</strong> ${selectedJob.location}</p>
              <p style="font-size: 18px;"><strong>Type d'emploi:</strong> ${selectedJob.employmentType}</p>
              <p style="font-size: 18px;"><strong>Date de publication:</strong> ${formatDate(selectedJob.datePosted)}</p>
              <hr style="border-top: 1px solid #ccc; margin: 20px 0;">
              <p style="font-size: 18px;"><strong>Description:</strong></p>
              <p style="font-size: 16px;">${selectedJob.description}</p>
            </div>
          </div>
        `
      };
  
      // Utilisez votre transporter nodemailer ici
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return res.status(500).json({ status: 500, message: 'Error sending email', error: error });
        }
        console.log('Email sent:', info.response);
        res.status(201).json({ status: 201, message: "Email envoyé avec succès" });
      });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ status: 500, message: "Erreur lors de l'envoi de l'email", error: error });
    }
  });
  




router.post('/api/jobs/', async (req, res) => {
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