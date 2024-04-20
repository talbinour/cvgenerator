// Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Informations</h3>
          <ul>
            <li><Link to="/about">À propos de nous</Link></li>
            <li><Link to="/contact">Contactez-nous</Link></li>
            <li><Link to="/terms">Conditions d&apos;utilisation</Link></li>
            <li><Link to="/privacy">Politique de confidentialité</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Liens utiles</h3>
          <ul>
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/cookies">Politique de cookies</Link></li>
            <li><Link to="/sitemap">Plan du site</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>© cevor 2024
          </h3>
          <p>Tous droits réservés.</p>
          <p>Ce site utilise des cookies pour améliorer l&apos;expérience utilisateur.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
