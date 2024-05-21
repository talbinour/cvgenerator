import React, { useState } from "react";
//import {  useNavigate } from "react-router-dom";
import styles from './dashboardPage.module.css';
import '@fortawesome/fontawesome-free/css/all.css';
import DashboardContent from './DashboardContent'; 
import Resumes from './ResumesPage'; 
import JobOffers from './JobOffersPage'; 
import Applications from './ApplicationsPage'; 
import TestComponent from './Skills'; 

const DashboardPage = () => {
  const [selectedItem, setSelectedItem] = useState("dashboard");
  const [showAlert, setShowAlert] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  //const navigate = useNavigate();

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

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
      case "test": 
        return <TestComponent />;
      default:
        return null;
    }
  };

  const showQuestionAlert = () => {
    setShowAlert(true);
  };

  /* const navigateToChatbot = () => {
    navigate("/cvselection");
  }; */

  return (
    <div className={styles['page-container']}>
      <div className={styles['content-area']}>
        <div className={styles['left-area']}>
          <div className={styles['question-icon']}>
            <i className={`fas fa-question-circle fa-2x ${styles['question-icon-style']}`} onClick={showQuestionAlert}></i>
          </div>
         {/* <button onClick={navigateToChatbot} className={styles['new-button']}>+ Nouveau</button> */}
          <ul className={styles['clickable-list']}>
            <li onClick={() => handleItemClick("dashboard")} className={selectedItem === 'dashboard' ? styles['selected'] : ''}>
              <i className="fas fa-tachometer-alt"></i>Tableau de bord
            </li>
            <li onClick={() => handleItemClick("resumes")} className={selectedItem === 'resumes' ? styles['selected'] : ''}>
              <i className="fas fa-file-alt"></i>CVs
            </li>
            <li onClick={() => handleItemClick("jobOffers")} className={selectedItem === 'jobOffers' ? styles['selected'] : ''}>
              <i className="fas fa-briefcase"></i>Offres d&lsquo;emploi
            </li>
            <li onClick={() => handleItemClick("applications")} className={selectedItem === 'applications' ? styles['selected'] : ''}>
              <i className="fas fa-paper-plane"></i>Mes conversations
            </li>
            <li onClick={() => handleItemClick("test")} className={selectedItem === 'test' ? styles['selected'] : ''}>
              <i className="fas fa-cogs"></i>Test
            </li>
          </ul>
        </div>
        <div className={styles['right-area']}>
          {getContent()}
        </div>
        {showAlert && (
          <div className={styles['alert-area']}>
            <div className={styles['top-area']}>
              
              <button onClick={() => setShowAlert(false)}>X</button>
            </div>
            <div className={styles['buttom-area']}>
             
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search..."
              />
              <button>Submit</button>
            </div>
          </div>
        )}
      </div>
      
    </div>
  );
};

export default DashboardPage;
