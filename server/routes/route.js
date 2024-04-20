const express = require('express');
const UserController = require('../userController');
const AuthController = require('../authController');
const Passwordreset = require('../passwordreset');
const UserInfo = require('../userDetails'); // Import UserInfo
const LogoutController = require('../LogoutController'); 
const bcrypt = require('bcrypt'); // Import bcrypt
const router = express.Router();
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const multer = require('multer');
const path = require('path');
const CVController = require('../controllers/CVController');

/// Configure storage for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Set your upload directory
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
  
const upload = multer({
    storage: storage,
    limits: { fileSize: 100000 }, // 100 KB in bytes
});
  
// Define your routes
router.post('/createUser', UserController.createUser);
router.put('/updateUser/:userId', upload.single('photo'), UserController.updateUser);
router.delete('/deleteUser/:userId', UserController.deleteUser);
router.get('/getAllUsers', UserController.getAllUsers);
router.put('/deleteAttribute/:userId', UserController.deleteAttribute);
router.get('/getUserByEmail/:email', UserController.getUserByEmail);
router.get('/getUserById/:id', UserController.getUserById);
router.post('/updateUserPhoto/:userId', upload.single('profileImage'), UserController.updateUserPhoto);
// CRUD CV 
const bodyParser = require('body-parser');

// Configure bodyParser middleware to handle JSON data with an increased size limit
router.use(bodyParser.json({ limit: '50mb' }));

// You may adjust the limit as needed
router.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

const cvController = new CVController();

router.post('/createCV', upload.single('image'), cvController.createCV);
router.get('/getCVs', cvController.getCVs);
router.get('/getCVById/:id', cvController.getCVById);
router.put('/updateCV/:id', cvController.updateCV);
router.delete('/deleteCV/:id', cvController.deleteCV);

// Create an instance of AuthController
const authControllerInstance = new AuthController();

// Use the getCurrentUsername method as a callback
router.get('/current-username', (req, res) => authControllerInstance.getCurrentUsername(req, res));

// Create an instance of Passwordreset class
const passwordResetInstance = new Passwordreset();

// Route for sending a password link
router.post('/sendpasswordlink', (req, res) => passwordResetInstance.sendVerificationCode(req, res));

// Route to verify verification code
router.post('/verify-reset-code', (req, res) => passwordResetInstance.verifyResetCode(req, res));

// Route to change password
// Utilize the already created instance at the top of the file
router.post('/change-password/:email/:token', async (req, res) => {
    try {
        console.log('Change Password Route Hit');
        const email = req.params.email;
        const { oldPassword, newPassword } = req.body;

        // Utilize the same instance of Passwordreset
        await passwordResetInstance.changePassword(req, res);
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const logoutControllerInstance = new LogoutController();
router.get('/logout', (req, res) => logoutControllerInstance.logout(req, res));

async function verifyTokenByEmail(email, token) {
    try {
        // Find the user by email
        const user = await UserInfo.findOne({ email });

        // Check if the user and the token exist
        if (user && user.verificationCode === token) {
            // Optionally, you may want to check if the token is expired or implement additional security checks
            return true;  // Token is valid
        } else {
            return false; // Token is invalid
        }
    } catch (error) {
        console.error('Error verifying token:', error);
        return false; // Assume token is invalid in case of an error
    }
}

module.exports = router;
