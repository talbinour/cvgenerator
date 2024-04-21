const mongoose = require('mongoose');

const cvSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // ID de l'utilisateur
  cvId: { type: String, required: true },   // ID du CV
  name: { type: String, required: true },   // Nom du candidat
  jobTitle: { type: String },               // Titre du poste
  phone: { type: String },                  // Numéro de téléphone
  email: { type: String },                  // Adresse e-mail
  website: { type: String },                // Site web
  linkedin: { type: String },               // Profil LinkedIn
  address: { type: String },                // Adresse
  education: [{                             // Liste des éducations
    period: { type: String },               // Période d'études
    degree: { type: String },               // Diplôme
    institution: { type: String }           // Institution
  }],
  languages: [{                             // Liste des langues
    name: { type: String },                 // Nom de la langue
    proficiency: { type: Number }           // Niveau de maîtrise
  }],
  profile:[ {                                // Profil du candidat
    type: String                           // Ajoutez d'autres attributs du profil si nécessaire
  }],
  experiences: [{                           // Liste des expériences professionnelles
    period: { type: String },               // Période de travail
    companyName: { type: String },          // Nom de l'entreprise
    jobTitle: { type: String },             // Titre du poste
    description: { type: String }           // Description des responsabilités
  }],
  professionalSkills: [{                    // Liste des compétences professionnelles
    skillName: { type: String },            // Nom de la compétence
    proficiency: { type: Number }           // Niveau de maîtrise
  }],
  interests: [{                            // Liste des centres d'intérêt
    name: { type: String }                 // Nom du centre d'intérêt
  }]
});

// Créer un modèle à partir du schéma
const CvModel = mongoose.models.Cv || mongoose.model('Cv', cvSchema);
module.exports = CvModel;