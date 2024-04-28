// AboutPage.jsx
import React from 'react';
import { FaRocket, FaLightbulb, FaUsers, FaEnvelope } from 'react-icons/fa';
import styles from './AboutPage.module.css';

const AboutPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>À propos de Cevor</h1>
        <div className={styles.grid}>
          <div className={styles.section}>
            <h2><FaRocket /> Notre Mission</h2>
            <p>Chez Cevor, notre mission est de simplifier le processus de création de CV et de rendre cette tâche aussi efficace et agréable que possible pour nos utilisateurs. Nous croyons que chaque individu mérite un CV professionnel qui mette en valeur ses compétences et son parcours de manière convaincante.</p>
          </div>
          <div className={styles.section}>
            <h2><FaLightbulb /> Notre Vision</h2>
            <p>Notre vision est de devenir la plateforme de référence pour la création de CV en ligne, en offrant des outils innovants, une expérience utilisateur exceptionnelle et un support personnalisé à nos utilisateurs. Nous aspirons à être reconnus comme le partenaire de confiance pour tous ceux qui cherchent à donner un nouvel élan à leur carrière professionnelle.</p>
          </div>
          <div className={styles.section}>
            <h2><FaUsers /> Nos Valeurs</h2>
            <ul>
              <li><strong>Qualité :</strong> Nous nous engageons à fournir des modèles de CV de haute qualité et des fonctionnalités robustes pour garantir la satisfaction de nos utilisateurs.</li>
              <li><strong>Accessibilité :</strong> Nous croyons en l&apos;accessibilité pour tous et nous nous efforçons de rendre notre plateforme facilement accessible à tous, quel que soit leur niveau de compétence en informatique.</li>
              <li><strong>Innovation :</strong> Nous sommes constamment à la recherche de nouvelles façons d&apos;améliorer notre plateforme et de proposer des fonctionnalités innovantes qui répondent aux besoins changeants de nos utilisateurs.</li>
              <li><strong>Intégrité :</strong> Nous nous engageons à agir avec intégrité et transparence dans toutes nos interactions avec nos utilisateurs et nos partenaires.</li>
            </ul>
          </div>
          <div className={styles.section}>
            <h2><FaUsers /> Notre Équipe</h2>
            <p>Notre équipe est composée de professionnels passionnés par la technologie et dévoués à offrir une expérience exceptionnelle à nos utilisateurs. Nous mettons tout en œuvre pour fournir un support de qualité et répondre aux besoins de nos utilisateurs de manière efficace et personnalisée.</p>
          </div>
          <div className={styles.section}>
            <h2><FaEnvelope /> Contactez-nous</h2>
            <p>Si vous avez des questions, des commentaires ou des suggestions, n&apos;hésitez pas à nous contacter. Notre équipe est là pour vous aider et répondre à toutes vos questions.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
