import React, { useState } from 'react';
import axios from 'axios';
import styles from './JobOffersPage.module.css';

const JobSearchInterface = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  const [formData, setFormData] = useState({
    query: '',
    employmentTypes: '',
    datePosted: '',
    distance: ''
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.get('https://jobs-api14.p.rapidapi.com/list', {
        params: formData,
        headers: {
          'X-RapidAPI-Key': 'c1920b4343msh2be3b5cf75bc49ap13305fjsn956054001cba',
          'X-RapidAPI-Host': 'jobs-api14.p.rapidapi.com'
        }
      });

      if (response.status === 200) {
        setSearchResults(response.data.jobs || []);
      } else {
        console.error('Error:', response.status);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const handleJobClick = (job) => {
    setSelectedJob(job);
  };
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Job Search Interface</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label htmlFor="query" className={styles.label}>Keywords:</label>
        <input type="text" id="query" name="query" value={formData.query} onChange={handleChange} required className={styles.input} />

        <label htmlFor="location" className={styles.label}>Location:</label>
        <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} required className={styles.input} />
        
        <label htmlFor="employmentTypes" className={styles.label}>Employment Types:</label>
        <select id="employmentTypes" name="employmentTypes" value={formData.employmentTypes} onChange={handleChange} multiple className={styles.select}>
          <option value="fulltime">Full-time</option>
          <option value="parttime">Part-time</option>
          <option value="intern">Intern</option>
          <option value="contractor">Contractor</option>
        </select>

        <label htmlFor="datePosted" className={styles.label}>Date Posted:</label>
        <select id="datePosted" name="datePosted" value={formData.datePosted} onChange={handleChange} required className={styles.select}>
          <option value="month">Month</option>
          <option value="week">Week</option>
          <option value="today">Today</option>
          <option value="3days">3 Days</option>
        </select>

        <label htmlFor="distance" className={styles.label}>Distance (km):</label>
        <input type="number" id="distance" name="distance" value={formData.distance} onChange={handleChange} min="0" className={styles.input} />

        <button type="submit" className={styles.button}>Search</button>
      </form>

      <div className={styles.results}>
        <h2 className={styles.resultsTitle}>Search Results</h2>
        <div className={styles.grid}>
          {searchResults.map((job, index) => (
            <div key={index} className={styles.jobContainer} onClick={() => handleJobClick(job.description)}>
              <div className={styles.jobHeader}>
                <h3>{job.title}</h3>
                <p>Company: {job.company}</p>
                <p>Location: {job.location}</p>
                <p>Employment Type: {job.employmentType}</p>
                <p>Date Posted: {job.datePosted}</p>
              </div>
              {selectedJob === job && (
                <div className={styles.jobDescription}>
                  <p>{job.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobSearchInterface;
