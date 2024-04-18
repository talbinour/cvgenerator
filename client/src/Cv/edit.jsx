import React, { useState, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.css';
import avatar from '../assets/cvprofile.jpeg';
import styles from './model7.module.css'; 

function ParentComponent() {
  // État local pour le modèle de CV
  const [cvModel, setCvModel] = useState({
    name: 'John Doe',
    jobTitle: 'Web Developer',
    phone: '0900 786 01',
    email: 'emmi@gmail.com',
    website: 'mywebsite.com',
    linkedin: 'www.linkedin.com',
    address: '56th street, california',
    education: [
      { period: '2017 - 2019', degree: 'Matric in Science', institution: 'School Name' },
      { period: '2019 - 2021', degree: 'Intermediate in Maths', institution: 'College Name' },
      { period: '2021 - Now', degree: 'Undergraduate in Computer Science', institution: 'University Name' }
    ],
    languages: [
      { name: 'English', proficiency: 90 },
      { name: 'Urdu', proficiency: 80 }
    ]
  });

  // Fonction pour charger le modèle de CV existant
  const loadModel = () => {
    // Code pour charger le modèle de CV existant depuis votre source de données (par exemple, un fichier JSON, une API, etc.)
    return {
      name: 'John Doe',
      jobTitle: 'Web Developer',
      phone: '0900 786 01',
      email: 'emmi@gmail.com',
      website: 'mywebsite.com',
      linkedin: 'www.linkedin.com',
      address: '56th street, california',
      education: [
        { period: '2017 - 2019', degree: 'Matric in Science', institution: 'School Name' },
        { period: '2019 - 2021', degree: 'Intermediate in Maths', institution: 'College Name' },
        { period: '2021 - Now', degree: 'Undergraduate in Computer Science', institution: 'University Name' }
      ],
      languages: [
        { name: 'English', proficiency: 90 },
        { name: 'Urdu', proficiency: 80 }
      ]
    };
  };

  useEffect(() => {
    // Charger le modèle de CV au chargement du composant
    setCvModel(loadModel());
  }, []);

  // Fonction pour gérer la sauvegarde du modèle de CV modifié
  const handleSave = () => {
    // Code pour sauvegarder les données modifiées
  };

  // Fonction pour gérer les changements dans le formulaire de modification pour les noms de langues
  const handleChangeLanguageName = (e, index) => {
    const newLanguages = [...cvModel.languages];
    newLanguages[index].name = e.target.value;
    setCvModel({ ...cvModel, languages: newLanguages });
  };

  // Fonction pour gérer les changements dans le formulaire de modification généraux
  const handleChange = () => {
    // Code pour gérer les changements dans le formulaire
  };

  return (
    <div className={`${styles['print-area']} ${styles.resume}`}>
      <div className={styles.container}>
        {/* Bouton de sauvegarde */}
        <div className={styles.editButton}>
          <button onClick={handleSave}><i className="fas fa-save"></i> Save</button>
        </div>
        <div className={styles.left_Side}>
          <div className={styles.profileText}>
            <div className={styles.imgBx}>
              <img src={avatar} alt="Profile" />  
            </div>
            {/* Formulaire pour modifier le nom et le titre */}
            <form>
              <span 
                name="name" 
                onBlur={handleChange} 
                placeholder="Your Name" 
                className={styles.input}
                contentEditable
              >{cvModel.name}</span>
              <span 
                name="jobTitle" 
                onBlur={handleChange} 
                placeholder="Your Job Title" 
                className={styles.input}
                contentEditable
              >{cvModel.jobTitle}</span>
            </form>
          </div>
          <div className={styles.contactInfo}>
            <h3 className={styles.title}>Contact Info</h3>
            <ul>
              <li>
                <span className={styles.icon}><i className="fa fa-phone" aria-hidden="true"></i></span>
                <span
                  name="phone"
                  onBlur={handleChange}
                  className={styles.input}
                  contentEditable
                >{cvModel.phone}</span>
              </li>
              <li>
                <span className={styles.icon}><i className="fa fa-envelope" aria-hidden="true"></i></span>
                <span
                  name="email"
                  onBlur={handleChange}
                  className={styles.input}
                  contentEditable
                >{cvModel.email}</span>
              </li>
              <li>
                <span className={styles.icon}><i className="fa fa-globe" aria-hidden="true"></i></span>
                <span
                  name="website"
                  onBlur={handleChange}
                  className={styles.input}
                  contentEditable
                >{cvModel.website}</span>
              </li>
              <li>
                <span className={styles.icon}><i className="fa fa-linkedin" aria-hidden="true"></i></span>
                <span
                  name="linkedin"
                  onBlur={handleChange}
                  className={styles.input}
                  contentEditable
                >{cvModel.linkedin}</span>
              </li>
              <li>
                <span className={styles.icon}><i className="fa fa-map-marker" aria-hidden="true"></i></span>
                <span
                  name="address"
                  onBlur={handleChange}
                  className={styles.input}
                  contentEditable
                >{cvModel.address}</span>
              </li>
            </ul>
          </div>
          <div className={`${styles.contactInfo} ${styles.education}`}>
            <h3 className={styles.title}>EDUCATION</h3>
            <ul>
              {cvModel.education.map((edu, index) => (
                <li key={index}>
                  <span contentEditable>{edu.period}</span>
                  <span contentEditable>{edu.degree}</span>
                  <span contentEditable>{edu.institution}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className={`${styles.contactInfo} ${styles.languages}`}>
            <h3 className={styles.title}>LANGUAGES</h3>
            <ul>
              {cvModel.languages.map((lang, index) => (
                <li key={index}>
                  <span
                    type="text"
                    value={lang.name}
                    onChange={(e) => handleChangeLanguageName(e, index)}
                    className={styles.input}
                    contentEditable
                  />
                  <div className={styles.percentContainer}>
                    <div className={styles.percentBar} style={{ width: `${lang.proficiency}%` }}></div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className={styles.right_Side}>
          {/* Votre contenu de droite ici */}
        </div>
      </div>
    </div>
  );
}

export default ParentComponent;
