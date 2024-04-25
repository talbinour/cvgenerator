import React, { useState, useEffect } from 'react';
import styles from './model7.module.css'; // Assurez-vous d'avoir le fichier model5.module.css dans votre projet
import '@fortawesome/fontawesome-free/css/all.css';
import avatar from '../assets/cvprofile.jpeg';
import axios from 'axios';
import * as htmlToImage from 'html-to-image';
import html2pdf from 'html2pdf.js';

function CvOuResume() {
  const [userId, setUserId] = useState(null);
  const [currentCVId, setCurrentCVId] = useState(null);
  const [imageURL, setImageURL] = useState('');
  const getCurrentCVId = () => {
    return currentCVId;
  };
  const [cvModel, setCvModel] = useState({
    name: 'John Doe',
    jobTitle: 'Développeur Web',
    phone: '0900 786 01',
    email: 'emmi@gmail.com',
    website: 'monsite.com',
    linkedin: 'www.linkedin.com',
    address: '56e rue, Californie',
    education: [
      { id: 1, period: '2017 - 2019', degree: 'Matric en Science', institution: 'Nom de l\'école' },
      { id: 2, period: '2019 - 2021', degree: 'Intermédiaire en Maths', institution: 'Nom du collège' },
      { id: 3, period: '2021 - Aujourd\'hui', degree: 'Licence en Informatique', institution: 'Nom de l\'université' }
    ],
    languages: [
      { id: 1, name: 'Anglais', proficiency: 90 },
      { id: 2, name: 'Ourdou', proficiency: 80 }
    ],
    profile: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Porro exercitationem nesciunt, tenetur architecto omnis maxime delectus quae quo reprehenderit quas laudantium. Itaque sequi commodi vero suscipit reiciendis ea aspernatur cum.',
    experiences: [
      { id: 1, period: '2019 - 2021', companyName: 'Société A', jobTitle: 'Développeur Web Senior', description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Porro exercitationem nesciunt, tenetur architecto omnis' },
      { id: 2, period: '2021 - présent', companyName: 'Société B', jobTitle: 'Analyste de Données', description: 'Lorem ipsum,dolor sit amet consectetur adipisicing elit. Porro exercitationem nesciunt,tenetur architecto omnis' }
    ],
    professionalSkills: [
      { id: 1, skillName: 'HTML', proficiency: 95 },
      { id: 2, skillName: 'CSS', proficiency: 70 },
      { id: 3, skillName: 'JavaScript', proficiency: 95 },
      { id: 4, skillName: 'Python', proficiency: 75 }
    ],
    interests: ['Trading', 'Développement', 'Gaming', 'Business']
  });

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      axios
        .get('http://localhost:8080/current-username', { withCredentials: true })
        .then((response) => {
          const userData = response.data.user;
          const userId = userData.id || userData.user_id;

          setUserId(userId);
          setCurrentCVId(userId);
          setCvModel({
            ...cvModel,
            name: userData.nom,
            jobTitle: userData.prenom,
            phone: userData.Nbphone,
            email: userData.email,
            address: userData.pays,
          });
        })
        .catch((error) => {
          console.error('Erreur lors de la récupération des informations utilisateur:', error);
        });
    }
  }, []);

  useEffect(() => {
    loadCVFromServer();
  }, [userId]);

  const loadCVFromServer = async () => {
    try {
      const cvId = getCurrentCVId();
      if (!cvId) {
        console.error('ID du CV non défini');
        return;
      }

      const response = await axios.get(`http://localhost:8080/cv/${userId}/${cvId}`);
      setCvModel(response.data.cvData);
    } catch (error) {
      console.error('Erreur lors du chargement du CV:', error);
    }
  };

  const generatePDF = () => {
    const element = document.getElementById('cv-content');

    if (!element) {
      console.error('Élément avec l\'ID "cv-content" introuvable.');
      return;
    }

    const opt = {
      margin: 0.5,
      filename: 'mon_cv.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().from(element).set(opt).save();
    handleDownload();
  };

  const handleDownload = async () => {
    try {
      const element = document.getElementById('cv-content');
      if (!element) {
        console.error('Élément avec l\'ID "cv-content" introuvable.');
        return;
      }

      const url = await htmlToImage.toPng(element, { quality: 0.8, width: 1100});
      setImageURL(url);

      const response = await fetch(url);
      const blob = await response.blob();
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const formData = new FormData();
      formData.append('image', blob, 'cv_image.png');
      formData.append('userId', userId);
      formData.append('imageURL', imageURL);

      const uploadResponse = await fetch('http://localhost:8080/api/save-image', {
        method: 'POST',
        body: formData
      });

      console.log('Réponse de téléchargement de l\'image:', uploadResponse);
    } catch (error) {
      console.error('Erreur lors de la manipulation du téléchargement:', error);
    }
  };

  return (
    <div className={`${styles['print-area']} ${styles.resume}`}>
      <div id="cv-content" className={styles.container}>
        <div className={styles.editButton}>
          <button onClick={() => generatePDF()} className={styles['new-button']}><i className="fas fa-file-pdf"></i>Télécharger</button>
        </div>
        <div className={styles.left_Side}>
          <div className={styles.profileText}>
            <div className={styles.imgBx}>
              <img src={avatar} alt="Profile" />
            </div>
            <h2>{cvModel.name} {cvModel.prenom}<br /><span>{cvModel.job}</span></h2>
          </div>
          <div className={styles.contactInfo}>
            <h3 className={styles.title}>Informations de Contact</h3>
            <ul>
              <li>
                <span className={styles.icon}><i className="fa fa-phone" aria-hidden="true"></i></span>
                <span className={styles.text}>{cvModel.phone}</span>
              </li>
              <li>
                <span className={styles.icon}><i className="fa fa-envelope" aria-hidden="true"></i></span>
                <span className={styles.text}>{cvModel.email}</span>
              </li>
              <li>
                <span className={styles.icon}><i className="fa fa-globe" aria-hidden="true"></i></span>
                <span className={styles.text}>{cvModel.website}</span>
              </li>
              <li>
                <span className={styles.icon}><i className="fa fa-linkedin" aria-hidden="true"></i></span>
                <span className={styles.text}>{cvModel.linkedin}</span>
              </li>
              <li>
                <span className={styles.icon}><i className="fa fa-map-marker" aria-hidden="true"></i></span>
                <span className={styles.text}>{cvModel.address}</span>
              </li>
            </ul>
          </div>
          <div className={`${styles.contactInfo} ${styles.education}`}>
            <h3 className={styles.title}>ÉDUCATION</h3>
            <ul>
              {cvModel.education.map((edu, index) => (
                <li key={index}>
                  <h5>{edu.period}</h5>
                  <h4>{edu.degree}</h4>
                  <h4>{edu.institution}</h4>
                </li>
              ))}
            </ul>
          </div>
          <div className={`${styles.contactInfo} ${styles.languages}`}>
            <h3 className={styles.title}>LANGUES</h3>
            <ul>
              {cvModel.languages && cvModel.languages.map((lang, index) => (
                <li key={index}>
                  <span className={styles.text}>{lang.name}</span>
                  <div className={styles.percentContainer}>
                    <div className={styles.percentBar} style={{ width: `${lang.proficiency}%` }}></div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className={styles.right_Side}>
          <div className={styles.about}>
            <h2 className={styles.title2}>Profil</h2>
            <p>{cvModel.profile}</p>
          </div>
          <div className={styles.about}>
            <h2 className={styles.title2}>Expérience</h2>
            {cvModel.experiences && cvModel.experiences.length > 0 && (
              cvModel.experiences.map((exp, index) => (
                <div className={styles.box} key={index}>
                  <div className={styles.year_company}>
                    <h5>{exp.period}</h5>
                    <h5>{exp.companyName}</h5>
                  </div>
                  <div className={styles.text}>
                    <h4>{exp.jobTitle}</h4>
                    <p>{exp.description}</p>
                  </div>
                </div>
              ))
            )}
         </div>
    
          <div className={`${styles.about} ${styles.skills}`}>
            <h2 className={styles.title2}>Compétences Professionnelles</h2>
            <div className={styles.skillContainer}>
              {cvModel.professionalSkills.map((skill, index) => (
                <div className={styles.skill} key={index}>
                  <span className={styles.skillName}>{skill.skillName}</span>
                  <div className={styles.progressBar}>
                    <div className={styles.progress} style={{ width: `${skill.proficiency}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.AboutInterest}>
            <h2 className={styles.title2}>Intérêts</h2>
            <ul>
              {cvModel.interests.map((interest, index) => (
                <li key={index}><i className="fa fa-circle" aria-hidden="true"></i>{interest}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CvOuResume;
