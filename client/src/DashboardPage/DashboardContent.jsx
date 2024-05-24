import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {  FaDownload, FaEdit } from 'react-icons/fa';
import moment from 'moment'; // Import de Moment.js
import styles from './DashboardContent.module.css';
import { FaBuilding, FaMapMarkerAlt, FaBriefcase, FaCalendarAlt, FaEye, FaTrash } from 'react-icons/fa';

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
      <h2>Mes Curriculum Vitae</h2> {/* Titre pour les CVs */}
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
        {jobsList
          .sort((a, b) => new Date(b.datePosted) - new Date(a.datePosted)) // Trier par date de publication décroissante
          .slice(0, 5) // Sélectionner les 5 derniers emplois
          .map((job) => (
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
  <div className={styles['alert-areaa']} style={{
    position: 'fixed',
    top: '8.5%',
    right: 0,
    overflowY: 'auto',
    width: '37%',
    height: 'calc(100% - 9%)',
    borderRadius: '3px',
    border: '2px solid #ccc',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    padding: '20px',
    flexDirection: 'column'
  }}>
    <div className={styles['job-details']} style={{
      paddingTop: '20px'
    }}>
      <button className={styles['close-button']} onClick={() => setSelectedJob(null)} style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        fontSize: '30px',
        color: '#1f4172',
        border: 'none',
        backgroundColor: 'transparent',
        cursor: 'pointer',
        transition: 'color 0.3s'
      }}>X</button>
      <h3 style={{
        fontSize: '24px',
        marginBottom: '10px',
        color: 'black'
      }}>{selectedJob.title}</h3>
      <div className={styles['job-info']} style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '10px'
      }}>
        <div style={{
          flex: 1
        }}>
          <p style={{
            fontSize: '20px',
            marginBottom: '5px',
            color: '#1d3063'
          }}><FaBuilding style={{ marginRight: '5px' }} /> Company: {selectedJob.company}</p>
          <p style={{
            fontSize: '20px',
            marginBottom: '5px',
            color: '#1d3063'
          }}><FaMapMarkerAlt style={{ marginRight: '5px' }} /> Location: {selectedJob.location}</p>
          <p style={{
            fontSize: '20px',
            marginBottom: '5px',
            color: '#1d3063'
          }}><FaBriefcase style={{ marginRight: '5px' }} /> Employment Type: {selectedJob.employmentType}</p>
          <p style={{
            fontSize: '20px',
            marginBottom: '20px',
            color: '#1d3063'
          }}><FaCalendarAlt style={{ marginRight: '5px' }} /> Date Posted: {formatDate(selectedJob.datePosted)}</p>
        </div>
      </div>
      <p style={{
        fontSize: '16px',
        color: 'rgb(70, 69, 69)'
      }}>{selectedJob.description.split('\n').map((paragraph, index) => (
        <React.Fragment key={index}>
          {paragraph}
          <br />
        </React.Fragment>
      ))}</p>
    </div>
  </div>
)}

    </div>
  );
};

export default DashboardContent;
