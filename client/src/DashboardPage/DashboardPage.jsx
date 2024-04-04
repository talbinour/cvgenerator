import React, { useState } from "react";
import { Link } from "react-router-dom"; // Importer la balise Link depuis react-router-dom
import styles from './dashboardPage.module.css';
import '@fortawesome/fontawesome-free/css/all.css';
import DashboardContent from './DashboardContent'; // Importer le composant DashboardContent
import Resumes from './ResumesPage'; // Importer le composant Resumes
import JobOffers from './JobOffersPage'; // Importer le composant JobOffers
import Applications from './ApplicationsPage'; // Importer le composant Applications
import TestComponent from './Skills'; // Importez le composant de test si vous l'avez déjà créé

const DashboardPage = () => {
  const [selectedItem, setSelectedItem] = useState("dashboard"); // État initial pour le tableau de bord
  const [showAlert, setShowAlert] = useState(false); // État pour afficher l'alerte
  const [searchInput, setSearchInput] = useState(""); // État pour le champ de recherche

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
      case "test": // Ajout du cas pour le test
        return <TestComponent />;
      default:
        return null;
    }
  };

  // Fonction pour afficher l'alerte
  const showQuestionAlert = () => {
    setShowAlert(true);
  };

  return (
    <div className={styles['print-area']}>
      <div className={styles['left-area']}>
        {/* Question mark icon with a contrasting border */}
        <div className={styles['question-icon']}>
          <i className={`fas fa-question-circle fa-2x ${styles['question-icon-style']}`} onClick={showQuestionAlert}></i>
        </div>
        {/* Button */}
        <button className={styles['new-button']}>+ Nouveau</button>
        {/* List of clickable items */}
        <ul className={styles['clickable-list']}>
          <li onClick={() => handleItemClick("dashboard")} className={selectedItem === 'dashboard' ? styles['selected'] : ''}>
            <i className="fas fa-tachometer-alt"></i> Tableau de bord
          </li>
          <li onClick={() => handleItemClick("resumes")} className={selectedItem === 'resumes' ? styles['selected'] : ''}>
            <i className="fas fa-file-alt"></i> Mes CV
          </li>
          <li onClick={() => handleItemClick("jobOffers")} className={selectedItem === 'jobOffers' ? styles['selected'] : ''}>
            <i className="fas fa-briefcase"></i> Offres d&apos;emplois
          </li>
          <li onClick={() => handleItemClick("applications")} className={selectedItem === 'applications' ? styles['selected'] : ''}>
            <i className="fas fa-file"></i> Candidatures
          </li>
          <li onClick={() => handleItemClick("test")} className={selectedItem === 'test' ? styles['selected'] : ''}>
            <i className="fas fa-file"></i> Test
          </li>
        </ul>
        {/* Rest of the content */}
      </div>
      <div className={styles['right-area']}>
        {/* Right area content */}
        {getContent()} {/* Afficher le contenu en fonction de l'élément sélectionné */}
      </div>
      {/* Section pour afficher l'alerte */}
      {showAlert && (
        <div className={styles['alert-area']}>
          <div className={`${styles['top-area']} ${styles['black-background']}`}>
            {/* Bouton pour fermer l'alerte */}
            <button onClick={() => setShowAlert(false)}>X</button>
          </div>
          <div className={styles['buttom-area']}>
            <input 
              type="text"
              name="search"
              placeholder="Chercher..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button>Chercher</button>
            <h1>Foire aux questions</h1>
            <div className={styles["questions"]}>
              <ul>
                <li>
                  <h4>Comment créer un compte ?</h4>
                  <p>Pour pouvoir utiliser toutes les fonctionnalités, il vous est demandé de créer un compte en saisissant votre adresse e-mail. Il est possible de créer un mot de passe par la suite.</p>
                </li>
                <li>
                  <h4>Comment créer un compte ?</h4>
                  <p>Pour pouvoir utiliser toutes les fonctionnalités, il vous est demandé de créer un compte en saisissant votre adresse e-mail. Il est possible de créer un mot de passe par la suite.</p>
                </li>
                <li>
                  <h4>Comment créer un compte ?</h4>
                  <p>Pour pouvoir utiliser toutes les fonctionnalités, il vous est demandé de créer un compte en saisissant votre adresse e-mail. Il est possible de créer un mot de passe par la suite.</p>
                </li>
                <li>
                  <h4>Comment créer un compte ?</h4>
                  <p>Pour pouvoir utiliser toutes les fonctionnalités, il vous est demandé de créer un compte en saisissant votre adresse e-mail. Il est possible de créer un mot de passe par la suite.</p>
                </li>
              </ul>

            </div>
            <p>Avez-vous d’autres questions, suggestions ou réclamations ?</p>
            <Link to="/contact" className={styles['black-background']}>contactez-nous -&gt;</Link> {/* Assurez-vous d'utiliser des accolades {} ici */}
          </div>
        </div>
      )}
    </div>
  );
};
export default DashboardPage;
