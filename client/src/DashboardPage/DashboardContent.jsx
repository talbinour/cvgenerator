import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import styles from './DashboardContent.module.css';

const Dashboard = () => {
  const [imageList, setImageList] = useState([]);
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [currentCVId, setCurrentCVId] = useState(null);
  const getCurrentCVId = () => {
    return currentCVId;
  };
  const fetchData = async () => {
    try {
      const userId =getCurrentCVId();
      if (!userId) {
        console.error('User ID is null or invalid.');
        return;
      }

      const response = await axios.get(`http://localhost:8080/user-cvs/${userId}`);
      const userCvs = response.data;
      setImageList(userCvs); // Mettre à jour l'état avec les CV récupérés
    } catch (error) {
      console.error('Erreur lors de la récupération des CV de l\'utilisateur:', error);
    }
  };
  // Fonction pour obtenir l'ID de l'utilisateur connecté
 

  useEffect(() => {
    const token = localStorage.getItem('token');
  
    if (token) {
      axios
          .get('http://localhost:8080/current-username', { withCredentials: true })
          .then((response) => {
              const userData = response.data.user;
              const userId = userData.id || userData.user_id;
  
              setUserId(userId);
              setCurrentCVId(userId); // Set currentCVId with userId
              
          })
          .catch((error) => {
              console.error('Erreur lors de la récupération des informations utilisateur:', error);
          });
    }
  }, []);
  useEffect(() => {
    fetchData();
  }, [userId]);
  const handleImageClick = (imageId) => {
    navigate(`/image/${imageId}`);
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <div className={`${styles['image-list']} ${styles['grid-view']}`}>
        {imageList.map((image) => (
          <div key={image._id} className={`${styles['image-item']} ${styles['grid-item']}`}>
            <img
              src={image.imageUrl}
              alt={image.imageName}
              className={styles['image']}
              onClick={() => handleImageClick(image._id)}
            />
            <div className={styles['image-details']}>
              <p className={styles['image-name']}>{image.imageName}</p>
              <div className={styles['image-actions']}>
                <FaTrash className={styles['action-icon']} /*onClick={() => handleDeleteClick(image._id)}*/ />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
