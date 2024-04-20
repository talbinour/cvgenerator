import React, { useState, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.css';
import avatar from '../assets/cvprofile.jpeg';
import styles from './model7.module.css'; 
import axios from 'axios'; // Importer Axios pour effectuer des requêtes HTTP

const ParentComponent = () =>  {
  const [currentCVId, setCurrentCVId] = useState(null); // Utiliser setCurrentCVId pour mettre à jour l'identifiant du CV
  const getCurrentCVId = () => {
    return currentCVId;
  };
  const [cvModel, setCvModel] = useState({
    name: 'John Doe',
    jobTitle: 'Web Developer',
    phone: '0900 786 01',
    email: 'emmi@gmail.com',
    website: 'mywebsite.com',
    linkedin: 'www.linkedin.com',
    address: '56th street, california',// Initialiser avec un tableau vide
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

  useEffect(() => {
    // Charger le modèle de CV depuis le serveur lors du chargement du composant
    loadCVFromServer();
  }, []);
  const getCurrentUserId = () => {
    const token = localStorage.getItem('token');
  
    if (token) {
      axios.get('http://localhost:8080/current-username', { withCredentials: true })
        .then(response => {
          setCurrentCVId(response.data.user.id); // Utiliser setCurrentCVId pour mettre à jour l'ID du CV
        })
        .catch(error => {
          console.error('Erreur lors de la récupération du nom d\'utilisateur :', error);
        });
    }
  };
  const loadCVFromServer = async () => {
    try {
      // Obtenez de manière synchrone l'ID de l'utilisateur actuel
      const userId = await getCurrentUserId();
      if (!userId) {
        console.error('User ID is undefined');
        return;
      }
  
      // Obtenez l'ID du CV (remplacez cette logique par votre propre méthode)
      const cvId = getCurrentCVId(); // Utilisez getCurrentCVId pour obtenir l'ID du CV
      if (!cvId) {
        console.error('CV ID is undefined');
        return;
      }
  
      // Faire une requête GET au serveur pour récupérer le CV
      const response = await axios.get(`http://localhost:8080/cv/${userId}/${cvId}`);
      // Mettre à jour le state avec les données récupérées
      setCvModel(response.data);
    } catch (error) {
      console.error('Error loading CV:', error);
    }
  };
  

  const saveCVToServer = async (userId) => { // Ajoutez userId comme argument
  try {
    if (!userId) {
      console.error('User ID is undefined');
      return;
    }

    const cvId = getCurrentCVId();
    if (!cvId) {
      console.error('CV ID is undefined');
      return;
    }

    const response = await axios.put(`http://localhost:8080/cv/${userId}/${cvId}`, cvModel);
    console.log('CV saved successfully:', response.data);
  } catch (error) {
    console.error('Error saving CV:', error);
  }
};

  
  // Fonction pour récupérer l'ID de l'utilisateur actuellement connecté
  

  const handleChangeLanguageName = (e, index) => {
    const newLanguages = [...cvModel.languages];
    newLanguages[index].name = e.target.value;
    setCvModel({ ...cvModel, languages: newLanguages });
  };

  const handleChange = () => {
    // Code pour gérer les changements dans le formulaire
  };

  return (
    <div className={`${styles['print-area']} ${styles.resume}`}>
      <div className={styles.container}>
        <div className={styles.editButton}>
          <input
            type="text"
            value={currentCVId}
            onChange={(e) => setCurrentCVId(e.target.value)}
            placeholder="Enter CV ID"
          />
          <button onClick={saveCVToServer}><i className="fas fa-save"></i> Save</button>
        </div>
        <div className={styles.left_Side}>
          <div className={styles.profileText}>
            <div className={styles.imgBx}>
              <img src={avatar} alt="Profile" />  
            </div>
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
              {cvModel.languages && cvModel.languages.map((lang, index) => (
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
        {/* Partie droite */}
        <div className={styles.right_Side}>
          <div className={styles.about}>
            <h2 className={styles.title2}>Profile</h2>
            <p contentEditable={true}>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Porro exercitationem nesciunt, tenetur architecto omnis maxime delectus quae quo reprehenderit quas laudantium. Itaque sequi commodi vero suscipit reiciendis ea aspernatur cum. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Porro exercitationem nesciunt, tenetur architecto omnis maxime delectus quae quo reprehenderit quas laudantium. Itaque sequi commodi vero suscipit reiciendis ea aspernatur cum.
            </p>
          </div>
          <div className={styles.about}>
            <h2 className={styles.title2}>Experience</h2>
            <div className={styles.box}>
              <div className={styles.year_company}>
                <h5>2019 - 2021</h5>
                <h5 contentEditable={true}>Company Name</h5>
              </div>
              <div className={styles.text}>
                <h4 contentEditable={true}>Senior Web Developer</h4>
                <p contentEditable={true}>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Porro exercitationem nesciunt, tenetur architecto omnis </p>
              </div>
            </div>
            <div className={styles.box}>
              <div className={styles.year_company}>
                <h5>2021 - present</h5>
                <h5 contentEditable={true}>Company Name</h5>
              </div>
              <div className={styles.text}>
                <h4 contentEditable={true}>Data Analyst</h4>
                <p contentEditable={true}>Lorem ipsum,dolor sit amet consectetur adipisicing elit. Porro exercitationem nesciunt,tenetur architecto omnis </p>
              </div>
            </div>
          </div>
          <div className={`${styles.about} ${styles.skills}`}>
            <h2 className={styles.title2}>Professional Skills</h2>
            <div className={styles.box}>
              <h4 contentEditable={true}>Html</h4>
              <div className={styles.percent}>
                <div style={{ width: '95%' }} contentEditable={true}></div>
              </div>
            </div>
            <div className={styles.box}>
              <h4 contentEditable={true}>CSS</h4>
              <div className={styles.percent}>
                <div style={{ width: '70%' }} contentEditable={true}></div>
              </div>
            </div>
            <div className={styles.box}>
              <h4 contentEditable={true}>JAVASCRIPT</h4>
              <div className={styles.percent}>
                <div style={{ width: '95%' }} contentEditable={true}></div>
              </div>
            </div>
            <div className={styles.box}>
              <h4 contentEditable={true}>PYTHON</h4>
              <div className={styles.percent}>
                <div style={{ width: '75%' }} contentEditable={true}></div>
              </div>
            </div>
          </div>
          <div className={styles.AboutInterest}>
            <h2 className={styles.title2}>Interest</h2>
            <ul contentEditable={true}>
              <li><i className="fa fa-bar-chart" aria-hidden="true"></i>Trading</li>
              <li><i className="fa fa-laptop" aria-hidden="true"></i>Developing</li>
              <li><i className="fa fa-gamepad" aria-hidden="true"></i>Gaming</li>
              <li><i className="fa fa-briefcase" aria-hidden="true"></i>Business</li>
            </ul>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default ParentComponent;

