// Import necessary modules and dependencies
const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cors = require('cors');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session'); // Include session middleware

// Import user model
const UserInfo = require('./userDetails');

class AuthController {
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
    this.initializePassport();
<<<<<<< HEAD
    this.router = router; // Call the function to initialize Passport
  }

  initializeRoutes() {
    router.post('/api/login', this.login.bind(this));
    // Add other authentication routes as needed
    router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
    router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
   (req, res) => {
    // Succès de l'authentification Google
    res.redirect('/'); // Redirigez vers la page d'accueil ou une autre route
  }
  );
=======
  }

  initializeRoutes() {
    // Enable CORS for login route
    this.router.post('/loginuser', cors(), this.loginUser.bind(this));
    this.router.options('*', cors()); // Handle CORS preflight for all routes

    // Google OAuth callback route
    this.router.get(
      '/auth/google/callback',
      passport.authenticate('google', {
        successRedirect: '/dashboard',
        failureRedirect: '/Login',
      }),
      (req, res) => {
        res.redirect('/dashboard');
      }
    );

    // Success and Logout routes
    this.router.get('/login/success', this.loginSuccess.bind(this));
    this.router.get('/logout', this.logout.bind(this));
>>>>>>> 5b3018c1871fdc4436e3fe5e83aa9c013522cf66
  }

  initializePassport() {
    // Configure session middleware
    this.router.use(
      session({
        secret: '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',
        resave: false,
        saveUninitialized: true,
      })
    );

    // Initialize Passport
    this.router.use(passport.initialize());
    this.router.use(passport.session());

    // Configure Google OAuth Strategy
    passport.use(
      new GoogleStrategy(
        {
<<<<<<< HEAD
          clientID: '1009937116596-6f9r93cvhchvr1oc9424it9citjo1drv.apps.googleusercontent.com',
          clientSecret: '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',
          callbackURL: '/auth/google/callback',
          scope: ['profile', 'email'],
=======
          clientID: "1009937116596-6f9r93cvhchvr1oc9424it9citjo1drv.apps.googleusercontent.com",
          clientSecret: "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",
          callbackURL: "/auth/google/callback",
<<<<<<< HEAD
          scope: ["profile", "email", "openid", "https://www.googleapis.com/auth/user.birthday.read", "https://www.googleapis.com/auth/user.phonenumbers.read"]
=======
          scope: ["profile", "email"]
>>>>>>> 5b3018c1871fdc4436e3fe5e83aa9c013522cf66
>>>>>>> 244590a2cc6b6d74937a3353aef0611d6135bd02
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            let user = await UserInfo.findOne({ googleId: profile.id });

            if (!user) {
<<<<<<< HEAD
              const password = Math.random().toString(36).slice(-8); // Générez un mot de passe aléatoire de 8 caractères
              const hashedPassword = await bcrypt.hash(password, 10); // Hasher le mot de passe

=======
>>>>>>> 5b3018c1871fdc4436e3fe5e83aa9c013522cf66
              user = new UserInfo({
                googleId: profile.id,
                displayName: profile.displayName,
                email: profile.emails[0].value,
<<<<<<< HEAD
                image: profile.photos[0].value,
=======
<<<<<<< HEAD
                nom: profile.name.givenName , // Utilisez le prénom de Google s'il est disponible, sinon laissez-le vide
                prenom: profile.name.familyName , // Utilisez le nom de famille de Google s'il est disponible, sinon laissez-le vide
                date_naissance: profile.birthdate , // Utilise la date de naissance de Google s'il est disponible, sinon laissez-le vide
                Nbphone: profile.phonenumber , // Utilise le numéro de téléphone de Google s'il est disponible, sinon laissez-le vide
                mot_passe: hashedPassword, // Vous pouvez générer un mot de passe aléatoire si nécessaire
=======
                image: profile.photos[0].value
>>>>>>> 5b3018c1871fdc4436e3fe5e83aa9c013522cf66
>>>>>>> 244590a2cc6b6d74937a3353aef0611d6135bd02
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
<<<<<<< HEAD
      
    // Serialize user into the session
=======

<<<<<<< HEAD
   // Configure Local Strategy
   passport.use(
    new LocalStrategy(
      { usernameField: 'email' },
      async (email, password, done) => {
        try {
          console.log('Attempting local authentication for email:', email);
=======
>>>>>>> 5b3018c1871fdc4436e3fe5e83aa9c013522cf66
    passport.serializeUser((user, done) => {
      done(null, user);
    });
>>>>>>> 244590a2cc6b6d74937a3353aef0611d6135bd02

          const user = await UserInfo.findOne({ email });

          if (!user) {
            console.log('User not found');
            return done(null, false, { message: 'Authentication failed' });
          }

          const isPasswordMatch = await user.comparePassword(password);

          if (!isPasswordMatch) {
            console.log('Invalid password');
            return done(null, false, { message: 'Authentication failed' });
          }

          console.log('Local authentication successful');
          return done(null, user);
        } catch (error) {
          console.error('Error during local authentication:', error);
          return done(error, null);
        }
      }
    )
  );

  // Serialize and deserialize user
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });
}

async loginUser(req, res, next) {
  console.log('Inside loginUser method');
  passport.authenticate('local', (err, user, info) => {
    console.log('Inside passport.authenticate callback');
    if (err) {
      console.log('Error during authentication:', err);
      return res.status(500).json({ status: 'Error', error: 'Authentication failed' });
    }
    if (!user) {
      console.log('Invalid email or password');
      return res.status(401).json({ status: 'Authentication failed' });
    }

    req.logIn(user, (err) => {
      if (err) {
        console.log('Error during req.logIn:', err);
        return res.status(500).json({ status: 'Error', error: 'Authentication failed' });
      }

      console.log('Login successful');
      // Redirect to the dashboard on successful login
      res.redirect('/dashboard');
    });
  })(req, res, next); // Pass the 'next' parameter here
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