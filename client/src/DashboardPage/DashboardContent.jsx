import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa'; // Importer l'icône de la corbeille
import styles from './DashboardContent.module.css'; // Importer les styles CSS du tableau de bord

const Dashboard = () => {
  const [cvList, setCvList] = useState([]);
  const navigate = useNavigate(); // Utilisez useNavigate() ici

  useEffect(() => {
    const fetchCvList = async () => {
      try {
        const response = await axios.get('http://localhost:8080/getCVs');
        // Dupliquez la liste pour créer un effet de boucle circulaire
        setCvList([...response.data, ...response.data]);
      } catch (error) {
        console.error("Failed to fetch CVs:", error);
      }
    };


    fetchCvList();
  }, []);

  const handleImageClick = (imageId) => {
    // Vous pouvez définir ici ce que vous voulez faire lorsque l'image est cliquée
    // Par exemple, naviguer vers une page détaillée de l'image
    navigate(`/image/${imageId}`);
  };
  

  return (
    <div>
      <h1>Dashboard</h1>
      {/* Afficher la liste des CV */}
      <div className={`${styles['cv-list']} ${styles['grid-view']}`}>
        {cvList.map((cv) => (
          <div key={cv._id} className={`${styles['cv-item']} ${styles['grid-item']}`}>
            {/* Gérer le clic sur l'image */}
            <img
              src={cv.imageURL}
              alt={cv.title}
              className={styles['cv-image']}
              onClick={() => handleImageClick(cv._id)}
            />
            <div className={styles['cv-details']}>
              <p className={styles['cv-title']}>{cv.title}</p>
              <div className={styles['cv-actions']}>
                 <FaTrash className={styles['action-icon']} /*onClick={() => handleDeleteClick(cv._id)}*/ /> 
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
