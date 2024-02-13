const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require('passport');
const session = require('express-session');
const initializeAdmin = require('./utils/initAdmin');
// Import MongoDB models
require('./userDetails');
require('./admin');
// Import AuthController
const AuthController = require('./authController');

// Load environment variables
dotenv.config();

// App setup
const app = express();
app.use(express.json());
app.use(morgan('dev'));

// Configure CORS before routes
app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

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
  serverSelectionTimeoutMS: 5000,
})
.then(() => {console.log('Connected to MongoDB');initializeAdmin();})
.catch((err) => {
  console.error('Error connecting to MongoDB:', err);
  process.exit(1);
});

// Import routes
const postRoutes = require('./routes/postRoutes');
const registerRoutes = require('./routes/registerRoutes');

// Routes setup
app.use('/post', postRoutes);
app.use('/register', registerRoutes);

// Google OAuth Callback
app.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: 'http://localhost:3000',
    failureRedirect: 'http://localhost:3000/login',
  })
);

// Create an instance of the AuthController
const authController = new AuthController();
// Respond to preflight requests

// Add CORS options for /loginuser
// Utilisez seulement la définition de route pour /loginuser
app.post('/loginuser', authController.loginUser.bind(authController));

// Error handling middleware
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    const validationErrors = Object.values(err.errors).map((error) => error.message);
    res.status(400).json({ error: 'Validation failed', details: validationErrors });
  } else {
    console.error(err.stack);
    res.status(500).send(`Something went wrong! Error: ${err.message}`);
  }
});

// Start the server
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server is running on port ${port}`));
