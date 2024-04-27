import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import styles from './DashboardContent.module.css';

const Dashboard = () => {
  const [cvsList, setCvsList] = useState([]);
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');

  const fetchData = async () => {
    try {
      if (!userId) {
        console.error('User ID is null or invalid.');
        return;
      }

      const response = await axios.get(`http://localhost:8080/user-cvs/${userId}`);
      setCvsList(response.data); // Mettre à jour l'état avec les CV récupérés
    } catch (error) {
      console.error('Erreur lors de la récupération des CV de l\'utilisateur:', error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:8080/current-username', { withCredentials: true })
        .then((response) => {
          const userData = response.data.user;
          const userId = userData.id || userData.user_id;
          setUserId(userId);
        })
        .catch((error) => {
          console.error('Erreur lors de la récupération des informations utilisateur:', error);
        });
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [userId]);

  const handleImageClick = (cvId) => {
    navigate(`/cv/${cvId}`);
  };

  const handleDeleteClick = (cvId) => {
    // Logique pour supprimer le CV
    console.log('Delete CV:', cvId);
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <div className={styles['cv-list']}>
        {cvsList.map((cv) => (
          <div key={cv._id} className={styles['cv-item']}>
            <img
              src={cv.imageUrl}
              alt={cv.imageName}
              className={styles['cv-image']}
              onClick={() => handleImageClick(cv._id)}
            />
            <div className={styles['cv-details']}>
              <p className={styles['cv-title']}>{cv.imageName}</p>
              <p> {cv.data}</p>
              <div className={styles['cv-actions']}>
                <FaTrash className={styles['action-icon']} onClick={() => handleDeleteClick(cv._id)} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
