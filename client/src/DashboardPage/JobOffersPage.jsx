import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './JobOffersPage.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faSuitcase, faBriefcase, faMapMarkerAlt, faCalendarAlt, faMapPin , faSearch, faHeart} from '@fortawesome/free-solid-svg-icons';
import { FaBuilding, FaMapMarkerAlt, FaBriefcase, FaCalendarAlt } from 'react-icons/fa';

import moment from 'moment'; // Import de Moment.js

const JobSearchInterface = () => {
  const [email, setEmail] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favoriteSelected, setFavoriteSelected] = useState(false); 
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get('http://localhost:8080/current-username', { withCredentials: true });
           const userData = response.data.user;
          setEmail(userData.email);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du nom d\'utilisateur :', error);
      }
    };

    fetchCurrentUser();
  }, []);
  const [formData, setFormData] = useState({
    query: '',
    location: '',
    employmentType: '',
    datePosted: 'month', // Default value set to 'month'
    distance: ''
  });
  const sendFavoriteJobEmail = async (job) => {
    try {
      const response = await axios.post(`http://localhost:8080/sendfavoritejob/${email}`, { email, selectedJob: job });
      console.log(response.data.message);
    } catch (error) {
      console.error('Error sending favorite job email:', error);
    }
  };
  

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('https://jobs-api14.p.rapidapi.com/list', {
        params: formData,
        headers: {
          'X-RapidAPI-Key': '5a736f8247mshce33c49290ce21ep16e096jsn96175f56f724',
          'X-RapidAPI-Host': 'jobs-api14.p.rapidapi.com'
        }
      });

      if (response.status === 200) {
        const jobs = response.data.jobs || [];
        const userId = localStorage.getItem('userId');
        const jobsWithUserId = jobs.map(job => ({ ...job, userId }));

        setSearchResults(jobs);

        await axios.post('http://localhost:8080/api/jobs', jobsWithUserId);
      } else {
        setError('Échec de la récupération des offres d\'emploi.');
      }
    } catch (error) {
      setError('Une erreur s\'est produite lors de la récupération des offres d\'emploi.');
    } finally {
      setLoading(false);
    }
  };

  const handleJobClick = (job) => {
    setSelectedJob(job);
   
  };
  const handleFavoriteClick = async (job) => {
    await sendFavoriteJobEmail(job);
    setFavoriteSelected(true);
  };
  const formatDate = (dateString) => {
    return moment(dateString).format('DD MMMM YYYY'); // Formatage de la date avec Moment.js
  };

  

  return (
    <div className={styles.container}>
      <h1 className={styles.title}><FontAwesomeIcon icon={faSearch} />Recherche d&apos;Emploi</h1>
      <h2 className={styles.pageSubtitle}>Trouvez votre emploi idéal</h2>
      <p className={styles.pageParagraph}>
          Utilisez notre outil de recherche d&lsquo;emploi pour trouver les offres correspondant à vos critères.
        </p>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <div className={styles.inputWrapper}>
            <label htmlFor="query" className={styles.label}> <FontAwesomeIcon icon={faBriefcase} />Poste :</label>
            <input type="text" id="query" name="query" value={formData.query} onChange={handleChange} required className={styles.input} placeholder="Poste" />
          </div>
          <div className={styles.inputWrapper}>
            <label htmlFor="location" className={styles.label}><FontAwesomeIcon icon={faMapMarkerAlt}  />Localisation :</label>
            <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} required className={styles.input}  placeholder="Localisation" />
          </div>
        </div>

        <div className={styles.label}>  <FontAwesomeIcon icon={faCalendarAlt} />  Date de publication :</div>
        <div className={styles.radioGroup}>
          <label className={styles.radioLabel}>
            <input type="radio" name="datePosted" value="month" onChange={handleChange} checked={formData.datePosted === 'month'} />
            Mois
          </label>
          <label className={styles.radioLabel}>
            <input type="radio" name="datePosted" value="week" onChange={handleChange} checked={formData.datePosted === 'week'} />
            Semaine
          </label>
          <label className={styles.radioLabel}>
            <input type="radio" name="datePosted" value="today" onChange={handleChange} checked={formData.datePosted === 'today'} />
            Aujourd&apos;hui
          </label>
          <label className={styles.radioLabel}>
            <input type="radio" name="datePosted" value="3days" onChange={handleChange} checked={formData.datePosted === '3days'} />
            3 Jours
          </label>
        </div>

        <label htmlFor="distance" className={styles.label}><FontAwesomeIcon icon={faMapPin} />Distance (km) :</label>
        <input type="number" id="distance" name="distance" value={formData.distance} onChange={handleChange} min="0" className={styles.input}  placeholder="Distance (km)" />

        <div className={styles.label}><FontAwesomeIcon icon={faSuitcase} />Types d&apos;emploi :</div>
        <div>
          <label>
            <input type="radio" name="employmentType" value="fulltime" onChange={handleChange} checked={formData.employmentType === 'fulltime'} />
            Temps plein
          </label>
          <label>
            <input type="radio" name="employmentType" value="parttime" onChange={handleChange} checked={formData.employmentType === 'parttime'} />
            Temps partiel
          </label>
          <label>
            <input type="radio" name="employmentType" value="intern" onChange={handleChange} checked={formData.employmentType === 'intern'} />
            Stagiaire
          </label>
          <label>
            <input type="radio" name="employmentType" value="contractor" onChange={handleChange} checked={formData.employmentType === 'contractor'} />
            Contractuel
          </label>
        </div>

        <button type="submit" className={styles.button}>Rechercher</button>
      </form>

      {loading && <p className={styles.loading}>Chargement...</p>}
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.results}>
        <h2 className={styles.resultsTitle}><FontAwesomeIcon icon={faSearch} />Résultats de la recherche</h2>
        <div className={styles.grid}>
          {searchResults.map((job, index) => (
            <div key={index} className={styles.jobContainer} onClick={() => handleJobClick(job)}>
              <div className={styles.jobHeader}>
                <h3>{job.title}</h3>
                <button onClick={() => handleFavoriteClick(job)} className={styles.favoriteButton}>
                  <FontAwesomeIcon icon={faHeart} style={{ color: favoriteSelected ? 'red' : 'black' }} />
                </button>
                <p>Entreprise : {job.company}</p>
                <p>Localisation : {job.location}</p>
                <p>Type d&apos;emploi : {job.employmentType}</p>
                <p>Date de publication : {job.datePosted}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

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

export default JobSearchInterface;
