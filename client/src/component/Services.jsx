import React from "react";
import { FaLaptop, FaUserTie, FaFileAlt } from "react-icons/fa";
import styles from "./Services.module.css";

const Services = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Nos Services</h1>
      <div className={styles.grid}>
        <div className={styles.service}>
          <FaLaptop className={styles.icon} />
          <h2 className={styles.serviceTitle}>Création de CV en ligne</h2>
          <p className={styles.description}>
            Créez votre CV en ligne de manière intuitive et professionnelle.
          </p>
        </div>
        <div className={styles.service}>
          <FaUserTie className={styles.icon} />
          <h2 className={styles.serviceTitle}>Coaching professionnel</h2>
          <p className={styles.description}>
            Bénéficiez de conseils d&apos;experts pour améliorer votre CV et votre
            profil professionnel.
          </p>
        </div>
        <div className={styles.service}>
          <FaFileAlt className={styles.icon} />
          <h2 className={styles.serviceTitle}>Modèles de CV variés</h2>
          <p className={styles.description}>
            Choisissez parmi une large gamme de modèles de CV adaptés à tous
            les secteurs d&apos;activité.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Services;
