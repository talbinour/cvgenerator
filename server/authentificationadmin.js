// authentificationadmin.js

const express = require('express');
const passport = require('passport');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

class AuthAdminController {
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.options('/loginadmin', this.loginAdmin.bind(this));
    this.router.post('/loginadmin', this.loginAdmin.bind(this));
    // ... Add other routes here
  }

  async loginAdmin(req, res) {
    try {
      await body('email').isEmail().run(req);
      await body('mot_passe').isLength({ min: 6 }).trim().run(req);

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, mot_passe } = req.body;
      const trimmedPassword = mot_passe.trim();

      const admin = await AdminInfo.findOne({ email });

      if (admin) {
        const passwordMatch = await bcrypt.compare(trimmedPassword, admin.mot_passe);

        if (passwordMatch) {
          const token = generateToken(admin);
          res.status(201).json({ status: 'ok', data: token, role: admin.role });
        } else {
          res.status(401).json({ status: 'Invalid Password' });
        }
      } else {
        res.status(401).json({ status: 'Admin not found' });
      }
    } catch (error) {
      console.error('Error in loginAdmin:', error);
      res.status(500).json({ status: 'Error', error: error.message });
    }
  }

  // Add other methods for admin authentication if needed

}

module.exports = AuthAdminController;
