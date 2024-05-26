import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./Cookies.css"; // Importation du fichier de style

export default function Cookies({ onConsentChange }) {
  const [consent, setConsent] = useState("pasvue");

  useEffect(() => {
    const storedConsent = localStorage.getItem("cookieConsent");
    if (storedConsent) {
      setConsent(storedConsent);
      if (onConsentChange) {
        onConsentChange(storedConsent);
      }
    }
  }, [onConsentChange]);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepté");
    setConsent("accepté");
    if (onConsentChange) {
      onConsentChange("accepté");
    }
  };

  const handleReject = () => {
    localStorage.setItem("cookieConsent", "refusée");
    setConsent("refusée");
    if (onConsentChange) {
      onConsentChange("refusée");
    }
  };

  if (consent !== "pasvue") return null;

  return (
    <div className="cookies-container"> {/* Ajout d'une classe pour le conteneur */}
      <div className="cookies-content"> {/* Ajout d'une classe pour le contenu */}
           {/* Ajout d'une classe pour l'icône */}
        
        <h2 className="cookies-title"><CookieIcon className="cookies-icon" /> Nous utilisons des cookies</h2> {/* Ajout d'une classe pour le titre */}
        <p className="cookies-text">
          Ce site utilise des cookies pour vous garantir la meilleure expérience sur notre site.
        </p> {/* Ajout d'une classe pour le texte */}
        <div className="button">
        <button className="cookies-accept" onClick={handleAccept}>Accepter</button> {/* Ajout d'une classe pour le bouton d'acceptation */}
        <a href="#" className="cookies-reject" onClick={handleReject}>Continuer sans accepter</a> 
        </div>
       
      </div>
    </div>
  );
}

function CookieIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
      <path d="M8.5 8.5v.01" />
      <path d="M16 15.5v.01" />
      <path d="M12 12v.01" />
      <path d="M11 17v.01" />
      <path d="M7 14v.01" />
    </svg>
  );
}

Cookies.propTypes = {
  onConsentChange: PropTypes.func,
};
