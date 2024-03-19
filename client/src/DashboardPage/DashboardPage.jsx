import React, { useState } from "react";
import styles from './dashboardPage.module.css';
import '@fortawesome/fontawesome-free/css/all.css';
import DashboardContent from './DashboardContent'; // Importer le composant DashboardContent
import Resumes from './ResumesPage'; // Importer le composant Resumes
import JobOffers from './JobOffersPage'; // Importer le composant JobOffers
import Applications from './ApplicationsPage'; // Importer le composant Applications

const DashboardPage = () => {
  const [selectedItem, setSelectedItem] = useState("dashboard"); // État initial pour le tableau de bord

  // Fonction pour gérer le clic sur un élément de la liste
  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  // Contenu correspondant à chaque élément de la liste
  const getContent = () => {
    switch (selectedItem) {
      case "dashboard":
        return <DashboardContent />;
      case "resumes":
        return <Resumes />;
      case "jobOffers":
        return <JobOffers />;
      case "applications":
        return <Applications />;
      default:
        return null;
    }
  };

  return (
    <div className={styles['print-area']}>
      <div className={styles['left-area']}>
        {/* Question mark icon with a contrasting border */}
        <div className={styles['question-icon']}>
          <i className={`fas fa-question-circle fa-2x ${styles['question-icon-style']}`}></i>
        </div>
        {/* Button */}
        <button className={styles['new-button']}>+ Nouveau</button>
        {/* List of clickable items */}
        <ul className={styles['clickable-list']}>
          <li onClick={() => handleItemClick("dashboard")} className={selectedItem === 'dashboard' ? styles['selected'] : ''}>
            <i className="fas fa-tachometer-alt"></i> Tableau de bord
          </li>
          <li onClick={() => handleItemClick("resumes")} className={selectedItem === 'resumes' ? styles['selected'] : ''}>
            <i className="fas fa-file-alt"></i> Curriculum Vitae
          </li>
          <li onClick={() => handleItemClick("jobOffers")} className={selectedItem === 'jobOffers' ? styles['selected'] : ''}>
            <i className="fas fa-briefcase"></i> Offres d&apos;emplois
          </li>
          <li onClick={() => handleItemClick("applications")} className={selectedItem === 'applications' ? styles['selected'] : ''}>
            <i className="fas fa-file"></i> Candidatures
          </li>
        </ul>
        {/* Rest of the content */}
      </div>
      <div className={styles['right-area']}>
        {/* Right area content */}
        {getContent()} {/* Afficher le contenu en fonction de l'élément sélectionné */}
      </div>
    </div>
  );
};

export default DashboardPage;
