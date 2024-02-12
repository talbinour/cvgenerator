const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cors = require('cors');
const jwt = require('jsonwebtoken');
const UserInfo = require('./userDetails');
const Admin = require('./admin'); // Import Admin model
const session = require('express-session');

// Ajoutez la fonction generateToken
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
    this.router.post('/loginuser', cors(), this.loginUser.bind(this));
    this.router.get('/auth/google/callback',
      passport.authenticate('google', {
        successRedirect: "/dashboard",
        failureRedirect: "/Login",
      }),
      (req, res) => {
        res.redirect('/dashboard');
      }
    );

    this.router.get('/login/success', this.loginSuccess.bind(this));
    this.router.get('/logout', this.logout.bind(this));
>>>>>>> 5b3018c1871fdc4436e3fe5e83aa9c013522cf66
  }

  initializePassport() {
    passport.use(
      new GoogleStrategy(
        {
          clientID: "1009937116596-6f9r93cvhchvr1oc9424it9citjo1drv.apps.googleusercontent.com",
          clientSecret: "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",
          callbackURL: "/auth/google/callback",
<<<<<<< HEAD
          scope: ["profile", "email", "openid", "https://www.googleapis.com/auth/user.birthday.read", "https://www.googleapis.com/auth/user.phonenumbers.read"]
=======
          scope: ["profile", "email"]
>>>>>>> 5b3018c1871fdc4436e3fe5e83aa9c013522cf66
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
                nom: profile.name.givenName , // Utilisez le prénom de Google s'il est disponible, sinon laissez-le vide
                prenom: profile.name.familyName , // Utilisez le nom de famille de Google s'il est disponible, sinon laissez-le vide
                date_naissance: profile.birthdate , // Utilise la date de naissance de Google s'il est disponible, sinon laissez-le vide
                Nbphone: profile.phonenumber , // Utilise le numéro de téléphone de Google s'il est disponible, sinon laissez-le vide
                mot_passe: hashedPassword, // Vous pouvez générer un mot de passe aléatoire si nécessaire
=======
                image: profile.photos[0].value
>>>>>>> 5b3018c1871fdc4436e3fe5e83aa9c013522cf66
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

>>>>>>> 5b3018c1871fdc4436e3fe5e83aa9c013522cf66
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
      // Try to find both admin and user with the provided email
      const user = await UserInfo.findOne({ email });
      const admin = await Admin.findOne({ email });

      if (user || admin) {
        // Determine if it's an admin or user login
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
