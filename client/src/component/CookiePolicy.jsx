import React from 'react';
import './cookiepolicy.model.css'; // Utilisation du fichier de style spécifié

const CookiePolicy = () => {
  return (
    <div className="cookie-policy-container">
      <h1>Politique des Cookies</h1>
      <p>Nous utilisons des cookies pour améliorer votre expérience sur notre site. Les cookies sont de petits fichiers texte stockés sur votre appareil qui nous permettent de nous souvenir de vos préférences et de certains détails de votre visite. Nos cookies ne stockent pas d&lsquo;informations personnelles comme votre nom ou votre adresse e-mail.</p>
      <h2>Types de Cookies utilisés :</h2>
      <ul>
        <li><strong>Cookies Essentiels</strong> : Ces cookies sont essentiels pour vous permettre de naviguer sur le site et d&lsquo;utiliser ses fonctionnalités, comme l&lsquo;accès aux zones sécurisées.</li>
        <li><strong>Cookies de Performance</strong> : Ces cookies collectent des informations sur la manière dont les visiteurs utilisent un site Web, par exemple, les pages les plus visitées et les messages d&lsquo;erreur éventuels.</li>
        <li><strong>Cookies de Fonctionnalité</strong> : Ces cookies permettent au site de se souvenir des choix que vous faites (comme votre nom d&lsquo;utilisateur, la langue ou la région où vous vous trouvez) et fournissent des fonctionnalités améliorées et plus personnelles.</li>
      </ul>
      <p>Vous avez la possibilité de contrôler et de configurer les cookies dans les paramètres de votre navigateur à tout moment. Notez que la désactivation des cookies peut limiter votre capacité à utiliser certaines fonctionnalités de notre site web.</p>
      <p>Pour plus d&lsquo;informations sur la gestion et la suppression des cookies, visitez <a href="http://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer">www.allaboutcookies.org</a>.</p>
    </div>
  );
};

export default CookiePolicy;
