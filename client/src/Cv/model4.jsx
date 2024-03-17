import React from 'react';
import '@fortawesome/fontawesome-free/css/all.css';
import styles from './model4.module.css';

function Model() {
  return (
    <div className={styles['print-area']}>
      <div className={styles.App}>
        {/* En-tête */}
        <header className={styles['App-header']}>
          <h1>JENNY CARSON</h1>
          <h2>WEB DESIGNER</h2>
        </header>
        {/* Contenu gauche et droit */}
        <div className={styles.content}>
          <div className={styles.leftSide}>
            {/* Section contact */}
            <section className={styles.contact}>
              <h3>CONTACT</h3>
              <ul>
                <li>
                  <span className={styles.icon}><i className="fa fa-phone"></i></span>
                  <span>Téléphone:</span> 123-456-7890
                </li>
                <li>
                  <span className={styles.icon}><i className="fa fa-envelope"></i></span>
                  <span>Email:</span> hello@developersite.com
                </li>
                <li>
                  <span className={styles.icon}><i className="fa fa-map-marker"></i></span>
                  <span>Adresse:</span> Entrez votre adresse ici
                </li>
              </ul>
            </section>

            {/* Section formation */}
            <section className={styles.education}>
              <h2>EDUCATION</h2>

              {/* Premier diplôme */}
              <div className={styles.degree}>
                <h3>MSC</h3>
                <h4>Conception et développement</h4>
                <h5>Université de Hull</h5>
                <h5>2010-2015</h5>
              </div>

              {/* Deuxième diplôme */}
              <div className={styles.degree}>
                <h3>BSC</h3>
                <h4>Conception et développement</h4>
                <h5>Université Arden</h5>
                <h5>2005-2010</h5>
              </div>
            </section>
          </div>

          <div className={styles.rightSide}>
            {/* Section profil */}
            <section className={styles.profile}>
              <h3>PROFILE</h3>
              <p>
                [Votre profil devrait donner une brève description de votre position dans
                votre cheminement de carrière. Incluez l&apos;expérience professionnelle
                pertinente, les qualifications et les compétences qui correspondent à la
                description du poste. Incluez également des détails sur les secteurs
                dans lesquels vous avez travaillé et mettez en évidence les réalisations
                pertinentes pour le poste visé.]
              </p>
            </section>

            {/* Section expérience professionnelle */}
            <section className={styles.experience}>
              <h2>EXPERIENCE PROFESSIONNELLE</h2>

              {/* Premier emploi */}
              <div className={styles.job}>
                <h3>Gestionnaire</h3>
                <h4>NOM DE L&apos;ENTREPRISE</h4>
                <h5>2020-2021</h5>
                <ul>
                  <li>
                    [Commencez chaque point par un verbe, par exemple : Gérer des
                    équipes de conception et de développement web.]
                  </li>
                  <li>
                    [Ajoutez des mots-clés de la description de poste dans votre CV.]
                  </li>
                  <li>
                    [Assurez-vous que vos emplois actuels et les plus récents figurent sur
                    la première page.]
                  </li>
                  <li>
                    [Restez bref, les relecteurs ne passent souvent que quelques
                    secondes à parcourir les CV.]
                  </li>
                </ul>
              </div>

              {/* Deuxième emploi */}
              <div className={styles.job}>
                <h3>UI/UX Designer</h3>
                <h4>NOM DE L&apos;ENTREPRISE</h4>
                <h5>2020-2021</h5>
                <ul>
                  <li>
                    [Commencez chaque point par un verbe, par exemple : Concevoir des
                    interfaces utilisateur attrayantes et intuitives.]
                  </li>
                  <li>
                    [Ajoutez des mots-clés de la description de poste dans votre CV.]
                  </li>
                  <li>
                    [Assurez-vous que vos emplois actuels et les plus récents figurent sur
                    la première page.]
                  </li>
                  <li>
                    [Restez bref, les relecteurs ne passent souvent que quelques
                    secondes à parcourir les CV.]
                  </li>
                  <li>
                    <strong>Réalisation clé:</strong> Conception d&apos;un site Web optimisé pour le référencement
                    pour une entreprise SaaS qui a augmenté le trafic jusqu&apos;à 300% en un
                    seul trimestre.
                  </li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Model;

