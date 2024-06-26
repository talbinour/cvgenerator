const express = require('express');
const UserController = require('../userController');
const AuthController = require('../authController');
const Passwordreset = require('../passwordreset');
const UserInfo = require('../userDetails'); // Import UserInfo
const LogoutController = require('../LogoutController'); 
const router = express.Router();
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const path = require('path');
const CVController = require('../controllers/CVController');
const editRouter = require('../editcv');
const testRoutes = require('../test'); 
const job = require('../jobs'); 
const bcrypt = require('bcrypt'); // Import bcrypt
const bodyParser = require('body-parser');
const multer = require('multer');
const CookieAcceptance = require('../CookieAcceptance');
const reviews = require('../reviews');
// Configure storage for multer
router.use('/', testRoutes);
router.use('/', job);
router.use('/', reviews);
// Configure bodyParser middleware to handle URL-encoded data with an increased parameter limit
router.use(bodyParser.urlencoded({ parameterLimit: 100000, limit: '50mb', extended: true }));
  
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
    limits: { fileSize: 50000000 }, 
});

// user api
router.post('/createUser', UserController.createUser);
router.put('/updateUser/:userId', upload.single('photo'), UserController.updateUser);
router.delete('/deleteUser/:userId', UserController.deleteUser);
router.get('/getAllUsers', UserController.getAllUsers);
router.put('/deleteAttribute/:userId', UserController.deleteAttribute);
router.get('/getUserByEmail/:email', UserController.getUserByEmail);
//router.get('/api/getUserImages/:userId', UserController.getUserImages);
router.get('/getUserById/:id', UserController.getUserById);
router.post('/updateUserPhoto/:userId', upload.single('profileImage'), UserController.updateUserPhoto);
// CRUD CV 
const cvController = new CVController();
router.post('/createCV', upload.single('image'), cvController.createCV);
router.get('/getCVs', cvController.getCVs);
router.get('/getCVById/:id', cvController.getCVById);
router.put('/updateCV/:id', cvController.updateCV);
router.delete('/deleteCV/:id', cvController.deleteCV);
router.use('/', editRouter); // Use the edit router here
// Use the getCurrentUsername method as a callback
router.get('/current-username', (req, res) => authControllerInstance.getCurrentUsername(req, res));
// Create an instance of AuthController
const authControllerInstance = new AuthController();
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
router.post('/accept-cookies', async (req, res) => {
    const { userId } = req.body;
    try {
      // Vérifiez si l'acceptation des cookies pour cet utilisateur existe déjà
      let acceptance = await CookieAcceptance.findOne({ userId });
  
      if (!acceptance) {
        // Si aucune acceptation n'existe, créez-en une nouvelle
        acceptance = new CookieAcceptance({ userId });
      }
  
      // Mettez à jour le statut d'acceptation des cookies
      acceptance.accepted = true;
      await acceptance.save();
  
      res.status(200).json({ message: 'Acceptation des cookies enregistrée avec succès' });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'acceptation des cookies :', error);
      res.status(500).json({ error: 'Erreur serveur lors de la mise à jour de l\'acceptation des cookies' });
    }
  });

module.exports = router;