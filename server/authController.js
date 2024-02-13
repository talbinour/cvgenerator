const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cors = require('cors');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const jwt = require('jsonwebtoken');
const { UserInfo } = require('./userDetails');
const flash = require('express-flash');  // Add this linec
class AuthController {
  constructor(app, passport, jwt, bcrypt) {
    this.app = app;
    this.passport = passport;
    this.jwt = jwt;
    this.bcrypt = bcrypt;
    this.initializeRoutes();
    this.initializePassport();
  }

  initializeRoutes() {
    this.app.post('/loginuser', this.loginUser.bind(this));
    this.app.get('/auth/google/callback', passport.authenticate('google', {
      successRedirect: '/dashboard',
      failureRedirect: '/login',
    }), (req, res) => {
      res.redirect('/dashboard');
    });
    this.app.use(flash());

    this.app.get('/login/success', this.loginSuccess.bind(this));
    this.app.get('/logout', this.logout.bind(this));
  }
  initializePassport() {
    this.app.use(
      session({
        secret: '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',
        resave: true,
        saveUninitialized: true,
        cookie: {
          secure: true, // Set to true for HTTPS
          sameSite: 'strict', // Adjust based on your needs
        },
      })
    );
  
    this.app.use(this.passport.initialize());
    this.app.use(this.passport.session());
  
    this.passport.use(
      new GoogleStrategy(
        {
          clientID: '1009937116596-6f9r93cvhchvr1oc9424it9citjo1drv.apps.googleusercontent.com',
          clientSecret: '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',
          callbackURL: '/auth/google/callback',
          scope: ['profile', 'email', 'openid', 'https://www.googleapis.com/auth/user.birthday.read', 'https://www.googleapis.com/auth/user.phonenumbers.read'],
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            let user = await UserInfo.findOne({ googleId: profile.id });
  
            if (!user) {
              const password = Math.random().toString(36).slice(-8);
              const hashedPassword = await this.bcrypt.hash(password, 10);
              user = new UserInfo({
                googleId: profile.id,
                displayName: profile.displayName,
                email: profile.emails[0].value,
                image: profile.photos[0].value,
                nom: profile.name.givenName || '',
                prenom: profile.name.familyName || '',
                date_naissance: profile.birthdate || '',
                Nbphone: profile.phonenumber || '',
                mot_passe: hashedPassword,
                image: profile.photos[0].value,
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
  
    // Inside LocalStrategy
    // Inside LocalStrategy
this.passport.use(new LocalStrategy(
  { usernameField: 'email', passwordField: 'mot_passe' },
  async (email, password, done) => {
    try {
      console.log('Email:', email);
      console.log('Password:', password);

      let user = await UserInfo.findOne({ email: email.toLowerCase() });

      console.log('User:', user);

      if (!user) {
        return done(null, false, { message: 'Authentication failed - User not found' });
      }

      const isValidPassword = await this.bcrypt.compare(password, user.mot_passe);

      if (isValidPassword) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Authentication failed - Invalid password' });
      }
    } catch (error) {
      console.error('Error during authentication:', error);
      return done(error, false, { message: 'Authentication failed - Internal server error' });
    }
  }
));

  
    // Serialize and deserialize user
    this.passport.serializeUser(function (user, done) {
      done(null, user);
    });
  
    this.passport.deserializeUser(function (user, done) {
      done(null, user);
    });
  }
  

  async loginUser(req, res, next) {
    try {
      this.passport.authenticate('local', async (err, user, info) => {
        if (err) {
          console.error('Error during authentication:', err);
          return res.status(500).json({ status: 'Authentication failed', message: 'Internal server error' });
        }

        if (!user) {
          console.error('User not found during authentication');
          return res.status(401).json({ status: 'Authentication failed', message: 'User not found' });
        }

        req.login(user, async (err) => {
          if (err) {
            console.error('Error during login:', err);
            return res.status(500).json({ status: 'Authentication failed', message: 'Internal server error' });
          }

          // Generate a JWT
          const token = this.jwt.sign({ userId: user._id }, 'yourSecretKey', { expiresIn: '1h' });

          // Attach the token to the user object
          user.jwtToken = token;

          // Save the user with the updated token
          await user.save();

          return res.status(200).json({ status: 'ok', data: { user, token } });
        });
      })(req, res, next);
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ status: 'Authentication failed', message: 'Internal server error' });
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
