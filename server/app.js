const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { UserInfo } = require('./userDetails');
const AuthController = require('./AuthController');
const LocalStrategy = require('passport-local').Strategy;
// Load environment variables
require('dotenv').config();

// App setup
const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.options('*', cors()); // Utilisez le middleware CORS pour les requêtes OPTIONS

// Define CORS options
const corsOptions = {
  origin: 'http://localhost:3000',  // Replace with your frontend's origin
  credentials: true,
};
app.options('/loginuser', cors(corsOptions)); 
// Use CORS with defined options
app.use(cors(corsOptions))
// Configure session before passport
app.use(session({
  secret: process.env.SESSION_SECRET || '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',
  resave: true,
  saveUninitialized: true,
}));

// Initialize Passport after session
app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Token not provided' });
  }

  jwt.verify(token.split(' ')[1], process.env.JWT_SECRET || 'yourSecretKey', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = decoded;
    next();
  });
};

// Protected route
app.get('/protected-route', verifyToken, (req, res) => {
  res.json({ message: 'This route is protected', user: req.user });
});

// User registration
app.post('/register', async (req, res) => {
  const { email, mot_passe } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(mot_passe, 10);
    const newUser = new UserInfo({ email, mot_passe: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Registration failed - Internal server error', error: error.message });
  }
});
app.post('/loginuser', passport.authenticate('local', {
  failureRedirect: '/login',
}), (req, res) => {
  const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET || 'yourSecretKey', { expiresIn: '1h' });
  res.json({ user: req.user, token });
  res.status(200).json({ status: 'ok', data: yourData });
});
// Handle authentication failure manually
app.use((err, req, res, next) => {
  if (err.name === 'AuthenticationError') {
    return res.status(401).json({ message: err.message });
  }
  next(err);
});

// Google login
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  }
);

// Instantiate AuthController
const authController = new AuthController(app, passport, jwt, bcrypt);

// Start the server
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server is running on port ${port}`));
