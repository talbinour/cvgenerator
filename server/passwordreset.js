const UserInfo = require('./userDetails');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'verif.cevor@gmail.com',
      pass: 'bslf cnyx hudg sllz',
    },
  });
  
  const generateToken = (userId,user) => {
    return true;
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
            subject: "Code de vérification pour réinitialisation du mot de passe",
            text: `Votre code de vérification est :${verificationCode}`,
            html: `<p>Votre code de vérification est :<strong>${verificationCode}</strong></p>`
          };
      
          // Utilisez votre transporter nodemailer ici
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              return console.error('Error sending email:', error);
            }
            console.log('Email sent:', info.response);
          });
      
          res.status(201).json({ status: 201, message: "code de  Verification envoyer avec succée" });
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
            console.error('Error verifying reset code:', error);
            res.status(500).json({ status: 500, error: 'Internal server error' });
          }
        }
        async changePassword(req, res) {
          try {
              const email = req.params.email;
              const { newPassword } = req.body;
      
              // Find the user by email
              const user = await UserInfo.findOne({ email });
      
              if (!user) {
                  return res.status(401).json({ status: 401, message: 'Invalid user' });
              }
      
              // Update user's password
              user.mot_passe = newPassword; // Assuming the new password is already plaintext
      
              // Set verificationCode to null after updating the password
              user.verificationCode = null;
      
              // Save the updated user (pre-save middleware will hash the password)
              await user.save();
      
              // Re-authenticate the user with the new credentials
              req.login(user, (loginErr) => {
                  if (loginErr) {
                      console.error('Error re-authenticating user after password change:', loginErr);
                      return res.status(500).json({ status: 500, message: 'Internal server error' });
                  }
      
                  console.log('Password changed successfully');
                  res.status(200).json({ status: 200, message: 'Password changed successfully' });
              });
          } catch (error) {
              console.error('Error changing password:', error);
              res.status(500).json({ status: 500, message: 'Internal server error' });
          }
      }
      
      
        
        
           
      }
module.exports = Passwordreset;