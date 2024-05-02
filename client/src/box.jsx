import React from 'react';
import PropTypes from 'prop-types'; // Import de PropTypes
import styles from './box.module.css'; // Import du fichier CSS pour styliser le contenu

const Box = () => {
  return (
    <div className={styles.App}>
      <header>
        <h1>Mon CV</h1>
      </header>

      <main>
        <PersonalInfoSection />
        <SkillsSection />
        <ExperienceSection />
        <EducationSection />
      </main>

      <footer>
        <p>&copy; 2024 [Votre nom]</p>
      </footer>
    </div>
  );
};

const PersonalInfoSection = () => {
  return (
    <section className={styles['personal-info']}> {/* Utilisation de la notation entre crochets pour les noms de classe CSS */}
      <h2>Informations personnelles</h2>
      <ul>
        <li>Nom: [Votre nom]</li>
        <li>Prénom: [Votre prénom]</li>
        <li>Adresse e-mail: [Votre adresse e-mail]</li>
        <li>Numéro de téléphone: [Votre numéro de téléphone]</li>
        <li>Adresse: [Votre adresse]</li>
      </ul>
    </section>
  );
};

const SkillsSection = () => {
  return (
    <section className={styles.skills}>
      <h2>Compétences</h2>
      <ul>
        <li>[Compétence 1]</li>
        <li>[Compétence 2]</li>
        <li>[Compétence 3]</li>
      </ul>
    </section>
  );
};

const ExperienceSection = () => {
  return (
    <section className={styles.experience}>
      <h2>Expériences professionnelles</h2>
      <ul>
        <ExperienceItem
          title="Développeur Web"
          company="Nom de l'entreprise"
          dates="2021-2024"
        >
          <ul>
            <li>Développement d&lsquo;applications Web front-end et back-end</li>
            <li>Maintenance et mise à jour des sites Web existants</li>
            <li>Collaboration avec des designers et des chefs de produit</li>
          </ul>
        </ExperienceItem>
        <ExperienceItem
          title="Ingénieur Informatique"
          company="Autre nom d'entreprise"
          dates="2019-2021"
        >
          <ul>
            <li>Installation et configuration de systèmes informatiques</li>
            <li>Dépannage de problèmes informatiques</li>
            <li>Support technique aux utilisateurs</li>
          </ul>
        </ExperienceItem>
      </ul>
    </section>
  );
};

const EducationSection = () => {
  return (
    <section className={styles.education}>
      <h2>Formations</h2>
      <ul>
        <EducationItem
          degree="Licence en informatique"
          school="Nom de l'école"
          dates="2017-2021"
        />
        <EducationItem
          degree="Baccalauréat scientifique"
          school="Nom du lycée"
          dates="2013-2017"
        />
      </ul>
    </section>
  );
};

const ExperienceItem = ({ title, company, dates, children }) => {
  return (
    <li>
      <h3>{title}</h3>
      <h4>{company}</h4>
      <p>{dates}</p>
      {children && <ul>{children}</ul>}
    </li>
  );
};

// Validation des props pour ExperienceItem
ExperienceItem.propTypes = {
  title: PropTypes.string.isRequired,
  company: PropTypes.string.isRequired,
  dates: PropTypes.string.isRequired,
  children: PropTypes.node
};

const EducationItem = ({ degree, school, dates }) => {
  return (
    <li>
      <h3>{degree}</h3>
      <h4>{school}</h4>
      <p>{dates}</p>
    </li>
  );
};

// Validation des props pour EducationItem
EducationItem.propTypes = {
  degree: PropTypes.string.isRequired,
  school: PropTypes.string.isRequired,
  dates: PropTypes.string.isRequired
};

export default Box;
