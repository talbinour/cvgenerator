import React, { useState, useEffect } from 'react';
import Chat from "../chatbot";
import axios from 'axios';
import styles from './CVModel7.module.css'; // Assurez-vous d'avoir le fichier model5.module.css dans votre projet
import '@fortawesome/fontawesome-free/css/all.css';
import avatar from '../assets/cvprofile.jpeg';
function CVModel7() {
  const [ setCvContent] = useState(""); // État pour stocker le contenu du CV
  const [userId, setUserId] = useState(null);
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
  }, [userId]);

  // Fonction pour mettre à jour le contenu du CV en fonction de la réponse de l'utilisateur
  const updateCvContent = (response) => {
    setCvContent(response); // Mettez à jour le contenu du CV avec la réponse de l'utilisateur
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.leftPanel}>
      <Chat updateCvContent={updateCvContent} /> 
      </div>   
      <div className={styles.rightPanel}>
      <div className={styles.container}>
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
            <h3 className={styles.title}>EDUCATION</h3>
            <ul>
              <li>
                <h5>2017 - 2019</h5>
                <h4>Matric in Science</h4>
                <h4>School Name</h4>
              </li>
              <li>
                <h5>2019 - 2021</h5>
                <h4>Intermediate in Maths</h4>
                <h4>College Name</h4>
              </li>
              <li>
                <h5>2021 - Now</h5>
                <h4>Undergraduate in Computer Science</h4>
                <h4>University Name</h4>
              </li>
            </ul>
          </div>
          <div className={`${styles.contactInfo} ${styles.languages}`}>
    <h3 className={styles.title}>LANGUAGES</h3>
    <ul>
        <li>
            <span className={styles.text}>English</span>
            <div className={styles.percentContainer}>
                <div className={styles.percentBar} style={{ width: '90%' }}></div>
            </div>
        </li>
        <li>
            <span className={styles.text}>Urdu</span>
            <div className={styles.percentContainer}>
                <div className={styles.percentBar} style={{ width: '80%' }}></div>
            </div>
        </li>
    </ul>
</div>

 
        </div>
        <div className={styles.right_Side}>
          <div className={styles.about}>
            <h2 className={styles.title2}>Profile</h2>
            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Porro exercitationem nesciunt,<br /> tenetur architecto omnis maxime delectus quae quo reprehenderit quas laudantium.Itaque sequi commodi vero suscipit reiciendis ea aspernatur cum.Lorem ipsum, dolor sit amet consectetur adipisicing elit. Porro exercitationem nesciunt,tenetur architecto omnis maxime delectus quae quo reprehenderit quas laudantium. <br />Itaque sequi commodi vero suscipit reiciendis ea aspernatur cum.</p>
          </div>
          <div className={styles.about}>
            <h2 className={styles.title2}>Experience</h2>
            <div className={styles.box}>
              <div className={styles.year_company}>
                <h5>2019 - 2021</h5>
                <h5>Company Name</h5>
              </div>
              <div className={styles.text}>
                <h4>Senior Web Developer</h4>
                <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Porro exercitationem nesciunt, tenetur architecto omnis </p>
              </div>
            </div>
            <div className={styles.box}>
              <div className={styles.year_company}>
                <h5>2021 - present</h5>
                <h5>Company Name</h5>
              </div>
              <div className={styles.text}>
                <h4>Data Analyst</h4>
                <p>Lorem ipsum,dolor sit amet consectetur adipisicing elit. Porro exercitationem nesciunt,tenetur architecto omnis </p>
              </div>
            </div>
          </div>
          <div className={`${styles.about} ${styles.skills}`}>
            <h2 className={styles.title2}>Professional Skills</h2>
            <div className={styles.box}>
              <h4>Html</h4>
              <div className={styles.percent}>
                <div style={{ width: '95%' }}></div>
              </div>
            </div>
            <div className={styles.box}>
              <h4>CSS</h4>
              <div className={styles.percent}>
                <div style={{ width: '70%' }}></div>
              </div>
            </div>
            <div className={styles.box}>
              <h4>JAVASCRIPT</h4>
              <div className={styles.percent}>
                <div style={{ width: '95%' }}></div>
              </div>
            </div>
            <div className={styles.box}>
              <h4>PYTHON</h4>
              <div className={styles.percent}>
                <div style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>
          <div className={styles.AboutInterest}>
            <h2 className={styles.title2}>Interest</h2>
            <ul>
              <li><i className="fa fa-bar-chart" aria-hidden="true"></i>Trading</li>
              <li><i className="fa fa-laptop" aria-hidden="true"></i>Developing</li>
              <li><i className="fa fa-gamepad" aria-hidden="true"></i>Gaming</li>
              <li><i className="fa fa-briefcase" aria-hidden="true"></i>Business</li>
            </ul>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

export default CVModel7;
