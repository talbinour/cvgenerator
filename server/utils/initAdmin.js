// InitializeAdmin.js
const Admin = require('../admin');

const initializeAdmin = async () => {
  try {
    const existingAdmin = await Admin.findOne({ email: 'admin@example.com' });

    if (!existingAdmin) {
      const admin = new Admin({
        email: 'admin@example.com',
        mot_passe: 'votreMotDePasseInitial',
      });

      await admin.save();
      console.log('Administrateur initial créé avec succès.');
    } else {
      console.log('L\'administrateur existe déjà.');
    }
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de l\'administrateur :', error);
  }
};

module.exports = initializeAdmin;
