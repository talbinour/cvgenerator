const express = require('express');
const CVModel = require('../CVModel');

class CVController {
  async createCV(req, res) {
    try {
      const { title, imageURL } = req.body;
      const file = req.files && req.files.file;

      const newCV = new CVModel({ title, imageURL });

      if (file) {
        newCV.fileURL = `/uploads/${file.name}`;
        newCV.fileName = file.name;
        await file.mv(`./public/uploads/${file.name}`);
      }

      const savedCV = await newCV.save();
      res.status(201).json(savedCV);
    } catch (error) {
      console.error('Error creating CV:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async getCVs(req, res) {
    try {
      const cvs = await CVModel.find();
      res.status(200).json(cvs);
    } catch (error) {
      console.error('Error getting CVs:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async getCVById(req, res) {
    try {
      const cvId = req.params.id;
      const cv = await CVModel.findById(cvId);
      
      if (!cv) {
        return res.status(404).json({ error: 'CV not found' });
      }

      res.status(200).json(cv);
    } catch (error) {
      console.error('Error getting CV by ID:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async updateCV(req, res) {
    try {
      const cvId = req.params.id;
      const { title, imageURL, content } = req.body;
      const updatedCV = await CVModel.findByIdAndUpdate(
        cvId,
        { title, imageURL, content },
        { new: true }
      );

      if (!updatedCV) {
        return res.status(404).json({ error: 'CV not found' });
      }

      res.status(200).json(updatedCV);
    } catch (error) {
      console.error('Error updating CV:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async deleteCV(req, res) {
    try {
      const cvId = req.params.id;
      const deletedCV = await CVModel.findByIdAndDelete(cvId);

      if (!deletedCV) {
        return res.status(404).json({ error: 'CV not found' });
      }

      res.status(200).json(deletedCV);
    } catch (error) {
      console.error('Error deleting CV:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = CVController;
