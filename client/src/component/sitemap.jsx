// Sitemap.js
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Sitemap.module.css';

const Sitemap = () => {
  return (
    <div className={styles.sitemapContainer}>
      <h1>Plan du site</h1>
      <ul className={styles.sitemapList}>
        <li><Link to="/">Accueil</Link></li>
        <li><Link to="/about">À propos</Link></li>
        <li><Link to="/services">Services</Link></li>
        <li><Link to="/cvselection">CV Sélection</Link></li>
        <li><Link to="/login">Connexion</Link></li>
        <li><Link to="/signup">Inscription</Link></li>
        <li><Link to="/dashboard">Tableau de bord</Link></li>
        <li><Link to="/JobOffers">Offres d&lsquo;emploi</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li><Link to="/userprofile">Profil Utilisateur</Link></li>
        <li><Link to="/Model">Modèles de CV</Link></li>
        <li><Link to="/chatbot">Chatbot</Link></li>
        <li><Link to="/box">Box</Link></li>
        <li><Link to="/new-password">Modification de mot de passe</Link></li>
        <li><Link to="/NewQuestion">Questions Nouvelles</Link></li>
        {/* Ajoutez d'autres éléments de menu si nécessaire */}
      </ul>
    </div>
  );
};

export default Sitemap;
