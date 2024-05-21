import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTrash, FaDownload, FaEdit, FaEye } from 'react-icons/fa';
import moment from 'moment'; // Import de Moment.js
import styles from './DashboardContent.module.css';

const DashboardContent = () => {
  const [cvsList, setCvsList] = useState([]);
  const [jobsList, setJobsList] = useState([]);
  const [selectedCV, setSelectedCV] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null); // État pour gérer l'emploi sélectionné
  const [userId, setUserId] = useState('');
  
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
    const fetchCVs = async () => {
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
    fetchCVs();
  }, [userId]);

  useEffect(() => {
    const fetchJobs = async () => {
      if (!userId) {
        console.error('User ID is null or invalid.');
        return;
      }
      try {
        const response = await axios.get(`http://localhost:8080/api/jobs/${userId}`);
        setJobsList(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des jobs de l\'utilisateur:', error);
      }
    };
    fetchJobs();
  }, [userId]);

  const formatDate = (dateString) => {
    return moment(dateString).format('DD MMMM YYYY'); // Formatage de la date avec Moment.js
  };

  const handleImageClick = (cvId, imageUrl, pageURL, date, userId, id, imageName, editurl) => {
    setSelectedCV({ cvId, imageUrl, pageURL, date, userId, id, imageName, editurl });
  };

  const handleJobClick = (job) => {
    setSelectedJob(job); // Définir l'emploi sélectionné
  };

  const handleDeleteClick = async (cvId) => {
    try {
      const confirmed = window.confirm('Êtes-vous sûr de vouloir supprimer cette image ?');
      if (!confirmed) {
        return;
      }

      const response = await axios.delete(`http://localhost:8080/cv/${userId}/${cvId}`);
      console.log('Image deleted successfully:', response.data);
      setCvsList(cvsList.filter(cv => cv._id !== cvId));
      alert('CV deleted successfully');
    } catch (error) {
      console.error('Error deleting CV:', error);
      alert('Failed to delete CV');
    }
  };

  return (
    <div>
    
      
      <h2>Mes CVs</h2> {/* Titre pour les CVs */}
      <div className={styles['cv-list']}>
        {cvsList.slice(-3).map((cv) => (
          <div key={cv._id} className={styles['cv-item']}>
            <img
              src={cv.imageUrl}
              alt={cv.imageName}
              className={styles['cv-image']}
              onClick={() => handleImageClick(cv.cvId, cv.imageUrl, cv.pageURL, cv.date, cv.userId, cv.id, cv.imageName , cv.editurl)}
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

      <h2>Suggestion d&lsquo;emplois</h2> {/* Titre pour les emplois */}
      <div className={styles['job-list']}>
        {jobsList.map((job) => (
          <div key={job._id} className={styles['job-item']}>
            <div className={styles['job-details']}>
              <h3 className={styles['job-title']}>{job.title}</h3>
              <p>Company: {job.company}</p>
              <p>Location: {job.location}</p>
              <p>Employment Type: {job.employmentType}</p>
              <p>Date Posted: {formatDate(job.datePosted)}</p>
              <div className={styles['job-actions']}>
                <FaEye className={styles['action-icon']} onClick={() => handleJobClick(job)} />
                <FaTrash className={styles['action-icon']} onClick={() => handleDeleteClick(job._id)} />
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

      {selectedJob && (
        <div className={styles['popup']}>
          <div className={styles['popup-content']}>
            <button className={styles['close-button']} onClick={() => setSelectedJob(null)}>X</button>
            <h3>{selectedJob.title}</h3>
            <p>Company: {selectedJob.company}</p>
            <p>Location: {selectedJob.location}</p>
            <p>Employment Type: {selectedJob.employmentType}</p>
            <p>Date Posted: {formatDate(selectedJob.datePosted)}</p>
            <p>{selectedJob.description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardContent;