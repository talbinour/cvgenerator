const UserInfo = require('./userDetails');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'nt0506972@gmail.com',
      pass: 'evrz qnsg pume fhdf',
    },
  });
  
  const generateToken = (user) => {
    // Implémentez votre logique de génération de token ici
    // Assurez-vous d'utiliser une bibliothèque comme jsonwebtoken
    // Exemple : return jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });
  };
   // Importez une fonction pour générer un code aléatoire
   const generateVerificationCode = () => {
    // Générez un code aléatoire à six chiffres
    return Math.floor(100000 + Math.random() * 900000);
  };
  
class Passwordreset {
  
    async sendVerificationCode(req, res) {
        const { email } = req.body;
      
        if (!email) {
          return res.status(401).json({ status: 401, message: "Enter Your Email" });
        }
      
        try {
          const user = await UserInfo.findOne({ email });
      
          // Générez un code de vérification
          const verificationCode = generateVerificationCode();
      
          // Enregistrez le code de vérification dans la base de données
          user.verificationCode = verificationCode;
          await user.save();
      
          // Options du courrier électronique
          const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "Verification Code for Password Reset",
            text: `Your verification code is: ${verificationCode}`,
            html: `<p>Your verification code is: <strong>${verificationCode}</strong></p>`
          };
      
          // Utilisez votre transporter nodemailer ici
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              return console.error('Error sending email:', error);
            }
            console.log('Email sent:', info.response);
          });
      
          res.status(201).json({ status: 201, message: "Verification code sent successfully" });
        } catch (error) {
          console.error('Error sending verification code:', error);
          res.status(401).json({ status: 401, message: "Invalid user or server error" });
        }
      }
      async handleUserRequest(req, res) {
        const { type } = req.params; // Assuming type is a parameter indicating the action (e.g., 'sendVerificationCode' or 'changePassword')
      
        try {
          switch (type) {
            case 'sendVerificationCode':
              await this.sendVerificationCode(req, res);
              break;
            case 'changePassword':
              await this.changePassword(req, res);
              break;
            default:
              res.status(400).json({ status: 400, message: 'Invalid request type' });
              break;
          }
        } catch (error) {
          console.error('Error handling user request:', error);
          res.status(500).json({ status: 500, message: 'Internal server error' });
        }
      }
      
        async changePassword(req, res) {
          const { id, token } = req.params;
          const { password } = req.body;
      
          try {
            const user = await UserInfo.findOne({ _id: id, resetToken: token, resetTokenExpiration: { $gt: Date.now() } });
      
            if (user) {
              // Update the user's password
              const hashedPassword = await bcrypt.hash(password, 10);
              user.mot_passe = hashedPassword;
      
              // Invalidate the reset token
              user.resetToken = null;
              user.resetTokenExpiration = null;
      
              // Save the updated user
              await user.save();
      
              res.status(201).json({ status: 201, message: 'Password reset successfully' });
            } else {
              res.status(401).json({ status: 401, message: "Invalid user or expired token" });
            }
          } catch (error) {
            console.error('Error resetting password:', error);
            res.status(401).json({ status: 401, error });
          }
        }
        async verifyResetCode(req, res) {
          try {
            const { verificationCode } = req.body;
            const user = await UserInfo.findOne({ verificationCode });
        
            if (user) {
              // Verification successful
              res.status(201).json({ status: 201, message: 'Verification successful' });
            } else {
              // Verification failed
              res.status(401).json({ status: 401, message: "Invalid verification code" });
            }
          } catch (error) {
            console.error('E  rror verifying reset code:', error);
            res.status(500).json({ status: 500, error: 'Internal server error' });
          }
        }
        
}

module.exports = Passwordreset;