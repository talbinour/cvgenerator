import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './ResumesPage.module.css';
import { FaTrash, FaDownload, FaEdit, FaTh, FaList } from 'react-icons/fa'; // Ajout de l'icône pour l'affichage en liste
import moment from 'moment';

const Dashboard = () => {
  const [cvsList, setCvsList] = useState([]);
  const [selectedCV, setSelectedCV] = useState(null);
  const [userId, setUserId] = useState('');
  const [isGridView, setIsGridView] = useState(true); // State variable to control layout type

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:8080/current-username', { withCredentials: true })
        .then(response => {
          const userData = response.data.user;
          const userId = userData.id || userData.user_id;
          setUserId(userId);
        })
        .catch(error => {
          console.error('Erreur lors de la récupération des informations utilisateur:', error);
        });
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        console.error('User ID is null or invalid.');
        return;
      }
      try {
        const response = await axios.get(`http://localhost:8080/user-cvs/${userId}`);
        setCvsList(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des CV de l\'utilisateur:', error);
      }
    };
    fetchData();
  }, [userId]);

  const formatDate = (dateString) => {
    return moment(dateString).format('DD MMMM YYYY'); // Formatage de la date avec Moment.js
  };

  const handleImageClick = (cvId, imageUrl, pageURL, date, userId, id, imageName, editurl) => {
    setSelectedCV({ cvId, imageUrl, pageURL, date, userId, id, imageName, editurl });
  };

  const handleDeleteClick = async (cvId) => {
    try {
      // Demande de confirmation à l'utilisateur avant de supprimer l'image
      const confirmed = window.confirm('Êtes-vous sûr de vouloir supprimer cette image ?');
      if (!confirmed) {
        return; // Annuler la suppression si l'utilisateur n'a pas confirmé
      }

      const response = await axios.delete(`http://localhost:8080/cv/${userId}/${cvId}`);
      console.log('Image deleted successfully:', response.data);
      // Si la suppression réussit, mettre à jour la liste des CVs pour refléter les modifications
      setCvsList(cvsList.filter(cv => cv._id !== cvId));
      // Afficher une alerte de confirmation ou effectuer d'autres actions nécessaires
      alert('CV deleted successfully');
    } catch (error) {
      console.error('Error deleting CV:', error);
      // Afficher une alerte d'erreur ou effectuer d'autres actions nécessaires en cas d'échec de suppression
      alert('Failed to delete CV');
    }
  };

  return (
    <div>
      <h1>Mes Curriculum Vitae</h1>
      {/* Ajout d'un bouton pour basculer entre l'affichage en grille et l'affichage en liste */}
      <div className={styles.toggleViewButtons}>
        <button onClick={() => setIsGridView(true)} className={isGridView ? styles.active : ''}><FaTh /></button>
        <button onClick={() => setIsGridView(false)} className={!isGridView ? styles.active : ''}><FaList /></button>
      </div>
      {/* Utilisation de la classe de style conditionnelle pour choisir entre l'affichage en grille et l'affichage en liste */}
      <div className={isGridView ? styles['cv-list'] : styles['cv-grid']}>
        {cvsList.map((cv) => (
          <div key={cv._id} className={styles['cv-item']}>
            <img
              src={cv.imageUrl}
              alt={cv.imageName}
              className={styles['cv-image']}
              onClick={() => handleImageClick(cv.cvId, cv.imageUrl, cv.pageURL, cv.date, cv.userId, cv.id, cv.imageName, cv.editurl)}
            />
            <div className={styles['cv-details']}>
              <p className={styles['cv-title']}>{cv.imageName}</p>
              <p>{formatDate(cv.date)}</p>
              <div className={styles['cv-actions']}>
                <FaTrash className={styles['action-icon']} onClick={() => handleDeleteClick(cv._id)} />
              </div>
            </div>
          </div>
        ))}
      </div>
      {selectedCV && (
        <div className={styles['alert-area']}>
          <div>
            <button className={styles['close-button']} onClick={() => setSelectedCV(null)}>X</button>
            <p className={styles['date-text']}>Date de création du CV : {formatDate(selectedCV.date)}</p>
          </div>
          <div className={styles['cv-content']}>
            <img src={selectedCV.imageUrl} alt="Selected CV" className={styles['full-cv-image']} />
          </div>
          <div className={styles['button-container']}>
            <button className={styles['edit-button']} onClick={() => window.open(`/${selectedCV.editurl}/${selectedCV.userId}/${selectedCV.cvId}/${selectedCV.id}`, '_blank')}>
              Edit <FaEdit />
            </button>
            <button className={styles['download-button']} onClick={() => window.open(selectedCV.pageURL, '_blank')}>
              Télécharger <FaDownload />
            </button>
            <button className={styles['delete-button']} onClick={() => handleDeleteClick(selectedCV.cvId)}>
              Supprimer <FaTrash />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
