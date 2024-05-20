import React, { useState } from 'react';
import axios from 'axios';
import Modal from './Modal';
import styles from './JobOffersPage.module.css';

const JobSearchInterface = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    query: '',
    location: '',
    employmentTypes: [],
    datePosted: '',
    distance: ''
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (event) => {
    const { options } = event.target;
    const value = [];
    for (let i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    setFormData({ ...formData, employmentTypes: value });
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
        setSearchResults(response.data.jobs || []);
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

  const handleCloseModal = () => {
    setSelectedJob(null);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}> Recherche d&apos;Emploi</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label htmlFor="query" className={styles.label}>Mots-clés :</label>
        <input type="text" id="query" name="query" value={formData.query} onChange={handleChange} required className={styles.input} />

        <label htmlFor="location" className={styles.label}>Localisation :</label>
        <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} required className={styles.input} />
        
        <label htmlFor="employmentTypes" className={styles.label}>Types d&apos;emploi :</label>
        <select id="employmentTypes" name="employmentTypes" value={formData.employmentTypes} onChange={handleSelectChange} multiple className={styles.select}>
          <option value="fulltime">Temps plein</option>
          <option value="parttime">Temps partiel</option>
          <option value="intern">Stagiaire</option>
          <option value="contractor">Contractuel</option>
        </select>

        <label htmlFor="datePosted" className={styles.label}>Date de publication :</label>
        <select id="datePosted" name="datePosted" value={formData.datePosted} onChange={handleChange} required className={styles.select}>
          <option value="month">Mois</option>
          <option value="week">Semaine</option>
          <option value="today">Aujourd&apos;hui</option>
          <option value="3days">3 Jours</option>
        </select>

        <label htmlFor="distance" className={styles.label}>Distance (km) :</label>
        <input type="number" id="distance" name="distance" value={formData.distance} onChange={handleChange} min="0" className={styles.input} />

        <button type="submit" className={styles.button}>Rechercher</button>
      </form>

      {loading && <p className={styles.loading}>Chargement...</p>}
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.results}>
        <h2 className={styles.resultsTitle}>Résultats de la recherche</h2>
        <div className={styles.grid}>
          {searchResults.map((job, index) => (
            <div key={index} className={styles.jobContainer} onClick={() => handleJobClick(job)}>
              <div className={styles.jobHeader}>
                <h3>{job.title}</h3>
                <p>Entreprise : {job.company}</p>
                <p>Localisation : {job.location}</p>
                <p>Type d&apos;emploi : {job.employmentType}</p>
                <p>Date de publication : {job.datePosted}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal show={selectedJob !== null} onClose={handleCloseModal}>
        {selectedJob && (
          <div>
            <h2>{selectedJob.title}</h2>
            <p>Entreprise : {selectedJob.company}</p>
            <p>Localisation : {selectedJob.location}</p>
            <p>Type d&apos;emploi : {selectedJob.employmentType}</p>
            <p>Date de publication : {selectedJob.datePosted}</p>
            <p>{selectedJob.description}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default JobSearchInterface;
