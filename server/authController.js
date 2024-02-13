const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cors = require('cors');
const jwt = require('jsonwebtoken');
const UserInfo = require('./userDetails');
const Admin = require('./admin');
const session = require('express-session');
const bcrypt = require('bcrypt');

const generateToken = (user) => {
  // Implémentez votre logique de génération de token ici
  // Assurez-vous d'utiliser une bibliothèque comme jsonwebtoken
  // Exemple : return jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });
};

class AuthController {
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
    this.initializePassport();
  }

  initializeRoutes() {
    this.router.post('/loginuser', cors(), this.loginUser.bind(this));
    this.router.get('/login/success', this.loginSuccess.bind(this));
    this.router.get('/logout', this.logout.bind(this));

    this.router.get('/auth/google/callback',
      passport.authenticate('google', {
        successRedirect: "/dashboard",
        failureRedirect: "/login",
      }),
      (req, res) => {
        res.redirect('/dashboard');
      }
    );
  }

  initializePassport() {
    passport.use(
      new GoogleStrategy(
        {
          clientID: "YOUR_GOOGLE_CLIENT_ID",
          clientSecret: "YOUR_GOOGLE_CLIENT_SECRET",
          callbackURL: "/auth/google/callback",
          scope: ["profile", "email", "openid", "https://www.googleapis.com/auth/user.birthday.read", "https://www.googleapis.com/auth/user.phonenumbers.read"]
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            let user = await UserInfo.findOne({ googleId: profile.id });

            if (!user) {
              const password = Math.random().toString(36).slice(-8);
              const hashedPassword = await bcrypt.hash(password, 10);
              user = new UserInfo({
                googleId: profile.id,
                displayName: profile.displayName,
                email: profile.emails[0].value,
                nom: profile.name.givenName || '',
                prenom: profile.name.familyName || '',
                date_naissance: profile.birthdate || '',
                Nbphone: profile.phonenumber || '',
                mot_passe: hashedPassword,
              });
              await user.save();
            }

            return done(null, user);
          } catch (error) {
            return done(error, null);
          }
        }
      )
    );

    passport.serializeUser((user, done) => {
      done(null, user);
    });

    passport.deserializeUser((user, done) => {
      done(null, user);
    });
  }

  async loginUser(req, res) {
    const { email, mot_passe } = req.body;
    try {
      const user = await UserInfo.findOne({ email });
      const admin = await Admin.findOne({ email });

      if (user || admin) {
        const targetUser = user || admin;
        const passwordMatch = await targetUser.comparePassword(mot_passe);
        if (passwordMatch) {
          const token = generateToken(targetUser);
          res.status(201).json({ status: 'ok', data: token, role: targetUser.role });
        } else {
          res.status(401).json({ status: 'Invalid Password' });
        }
      } else {
        res.status(404).json({ status: 'User/Admin Not Found' });
      }
    } catch (error) {
      res.status(500).json({ status: 'Error', error: error.message });
    }
  }

  async loginSuccess(req, res) {
    if (req.user) {
      res.status(200).json({ message: 'User Login', user: req.user });
    } else {
      res.status(400).json({ message: 'Not Authorized' });
    }
  }

  logout(req, res, next) {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect('http://localhost:3000');
    });
  }
}

module.exports = AuthController;