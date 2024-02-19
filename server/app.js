const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require('passport');
const session = require('express-session');
const { body, validationResult } = require('express-validator');

// Import MongoDB models
const UserInfo = require('./userDetails');
const Admin = require('./admin');
const AuthController = require('./authController');

// Load environment variables
dotenv.config();

// App setup
const app = express();
const router = express.Router(); // Add this line to create an instance of express.Router()
app.use(express.json());
app.use(morgan('dev'));

// Configure CORS before routes
app.use(cors({
  credentials: true,
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
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
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

// Import routes
const postRoutes = require('./routes/postRoutes');
const registerRoutes = require('./routes/registerRoutes');
const route = require('./routes/route');
// Routes setup
app.use('/post', postRoutes);
app.use('/register', registerRoutes);
app.use('/',route);
// Google OAuth Callback
app.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: 'http://localhost:3000/dashboard',
    failureRedirect: 'http://localhost:3000/login',
  })
);

// Create an instance of the AuthController
const authController = new AuthController();
/// Route for email verification
app.get('/verify-email/:emailToken', authController.verifyEmail.bind(authController));

// Route for password link
router.options('/sendpasswordlink', cors()); // Add this route for OPTIONS
router.post('/sendpasswordlink', authController.sendPasswordLink.bind(authController));

// Assuming you have a method like this in AuthController
router.get('/forgotpassword/:id/:token', authController.verifyForgotPasswordToken.bind(authController));

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

app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    return res.status(200).json({});
  }
  next();
});
app.use('/', cors(), router);

// Start the server
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server is running on port ${port}`));
