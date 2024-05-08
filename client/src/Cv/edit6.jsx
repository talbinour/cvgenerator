import React, { useState, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.css';
import avatar from '../assets/cvprofile.jpeg';
import styles from './edit6.module.css';
import axios from 'axios'; 
import CvOrResume from './model6';
import {  useNavigate } from "react-router-dom";

const ParentComponent = () => {
  const navigate = useNavigate();
  const [currentCVId, setCurrentCVId] = useState(null);
  const [currentCVDate, setCurrentCVDate] = useState(null);
  const [userPhoto, setUserPhoto] = useState(null);
  //const [date] = useState(null);

  const getCurrentCVId = () => {
    return currentCVId;
  };
  const getCurrentCVDate = () => {
    return currentCVDate;
  };

 
  const [cvModel, setCvModel] = useState({
    name: 'John Doe',
    jobTitle: 'Web Developer',
    phone: '0900 786 01',
    email: 'emmi@gmail.com',
    website: 'mywebsite.com',
    linkedin: 'www.linkedin.com',
    address: '56th street, California',
    education: [
      { id: 1, period: { startDate: '2019-01-01', endDate: '2021-01-01'}, degree: 'Matric in Science', institution: 'School Name' },
      { id: 2, period: { startDate: '2019-01-01', endDate: '2021-01-01'}, degree: 'Intermediate in Maths', institution: 'College Name'},
      { id: 3, period: { startDate: '2019-01-01', endDate: '2021-01-01'}, degree: 'Undergraduate in Computer Science', institution: 'University Name'}
    ],
    
    languages: [
      { id: 1, name: 'English', proficiency: 90 },
      { id: 2, name: 'Urdu', proficiency: 80 }
    ],
    profile: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Porro exercitationem nesciunt, tenetur architecto omnis maxime delectus quae quo reprehenderit quas laudantium. Itaque sequi commodi vero suscipit reiciendis ea aspernatur cum. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Porro exercitationem nesciunt, tenetur architecto omnis maxime delectus quae quo reprehenderit quas laudantium. Itaque sequi commodi vero suscipit reiciendis ea aspernatur cum.',
    experiences: [
      { 
        id: 1, 
        period: { startDate: '2019-01-01', endDate: '2021-01-01'},
        companyName: 'Company A', 
        jobTitle: 'Senior Web Developer', 
        description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Porro exercitationem nesciunt, tenetur architecto omnis' 
      },
      { 
        id: 2, 
        period: { startDate: '2019-01-01', endDate: '2021-01-01'},
        companyName: 'Company B', 
        jobTitle: 'Data Analyst', 
        description: 'Lorem ipsum,dolor sit amet consectetur adipisicing elit. Porro exercitationem nesciunt,tenetur architecto omnis' 
      }
    ],
    professionalSkills: [
      { id: 1, skillName: 'HTML', proficiency: 95 },
      { id: 2, skillName: 'CSS', proficiency: 70 },
      { id: 3, skillName: 'JavaScript', proficiency: 95 },
      { id: 4, skillName: 'Python', proficiency: 75 }
    ],
    interests: ['Trading', 'Developing', 'Gaming', 'Business'],
    photo: null
  });
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      axios
          .get('http://localhost:8080/current-username', { withCredentials: true })
          .then((response) => {
              const userData = response.data.user;
              const userId = userData.id || userData.user_id;
              
              setUserPhoto(response.data.user.photo);
              setUserId(userId);
              setCurrentCVId(userId);
              setCvModel({
                ...cvModel,
                name: userData.nom+' '+userData.prenom,
                phone: userData.Nbphone,
                email: userData.email,
                address: userData.pays,
                profession:userData.profession,
                photo:userData.photo,
            
              });
          })
          .catch((error) => {
              console.error('Erreur lors de la récupération des informations utilisateur:', error);
          });
    }
  }, []);
 useEffect(() => {
  loadCVFromServer();
}, [userId,currentCVDate]); // Assurez-vous d'inclure cvDate dans les dépendances de useEffect

const loadCVFromServer = async () => {
  try {
    const cvId = getCurrentCVId();
    const date = getCurrentCVDate(); // Get the currentCVDate

    if (!cvId) {
      console.error('CV ID is undefined');
      return;
    }

    const response = await axios.get(`http://localhost:8080/cv/${userId}/${cvId}/${date}`);
    
    // Assuming the response.data contains the CV data
    setCurrentCVDate(response.data.date);
    setCvModel(response.data.cvData);
  } catch (error) {
    console.error('Error loading CV:', error);
  }
};


const saveCVToServer = async () => {
  try {
    // Vérifiez si la date est nulle, et attribuez-lui une valeur par défaut si c'est le cas
    const date = getCurrentCVDate() || new Date().toISOString(); // Utilisez la date actuelle comme valeur par défaut
    const requiredFields = ['name', 'phone', 'email', 'address', 'profile'];
    const isEmptyField = requiredFields.some(field => !cvModel[field]);
    if (isEmptyField) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    const cvId = getCurrentCVId();
    if (!cvId) {
      console.error('CV ID is undefined');
      return;
    }
    const response = await axios.put(`http://localhost:8080/cv/${userId}/${cvId}/${date}`, cvModel);
    console.log('CV saved successfully:', response.data);
    navigate(`/model7-user/${userId}/${cvId}/${date}`);
  } catch (error) {
    console.error('Error saving CV:', error);
  }
};

 const handleChange = (e, field) => {
    const { value } = e.target;
    setCvModel(prevModel => ({
      ...prevModel,
      [field]: value
    }));
  };
  const handleChangeLanguageName = (e, index) => {
    const newLanguages = [...cvModel.languages];
    newLanguages[index].name = e.target.value;
    setCvModel({ ...cvModel, languages: newLanguages });
  };
  const handleExperienceChange = (e, index, field) => {
    const newExperiences = [...cvModel.experiences];
    const { value } = e.target;
    newExperiences[index][field] = value;
    if (newExperiences[index].startDate && newExperiences[index].endDate) {
      if (field === 'startDate' && value >= newExperiences[index].endDate) {
        alert("La date de début doit être après la date de fin.");
        return;
      }
      if (field === 'endDate' && value <= newExperiences[index].startDate) {
        alert("La date de fin doit être après la date de début");
        return;
      }
    }
    setCvModel({ ...cvModel, experiences: newExperiences });
  };
 const handleSkillChange = (e, index, field) => {
    const newSkills = [...cvModel.professionalSkills];
    newSkills[index][field] = e.target.value;
    setCvModel({ ...cvModel, professionalSkills: newSkills });
  };
 const handleEducationChange = (e, index, field) => {
    const newEducation = [...cvModel.education];
    const { value } = e.target;
   newEducation[index][field] = value;
    if (newEducation[index].startDate && newEducation[index].endDate) {
      if (field === 'startDate' && value >= newEducation[index].endDate) {
        alert("La date de début doit être après la date de fin.");
        return;
      }
      if (field === 'endDate' && value <= newEducation[index].startDate) {
        alert("La date de fin doit être après la date de début");
        return;
      }
    }
    setCvModel({ ...cvModel, education: newEducation });
  };

  if (!cvModel) {
    return <CvOrResume />;
  }
 const addEducation = () => {
  const newEducation = { startDate: '', endDate: '', degree: '', institution: '' };
  setCvModel(prevModel => ({
    ...prevModel,
    education: [...prevModel.education, newEducation]
  }));
};
const addLanguage = () => {
  setCvModel(prevModel => ({
    ...prevModel,
    languages: [...prevModel.languages, { name: '', proficiency: 0 }]
  }));
};
const addExperience = () => {
  setCvModel(prevModel => ({
    ...prevModel,
    experiences: [...prevModel.experiences, { period: { startDate: '', endDate: '' }, companyName: '', jobTitle: '', description: '' }]
  }));
};
const addSkill = () => {
  setCvModel(prevModel => ({
    ...prevModel,
    professionalSkills: [...prevModel.professionalSkills, { skillName: '', proficiency: 0 }]
  }));
};
const addInterest = () => {
  setCvModel(prevModel => ({
    ...prevModel,
    interests: [...prevModel.interests, '']
  }));
};
return (
    <div className={`${styles['print-area']} ${styles.resume}`}>
        <div   className={styles.container}>
        <div className={styles.editButton}>
          <a href="#" onClick={saveCVToServer}><i className="fas fa-check"></i></a>
        </div>
        <div className={styles.left_Side}>
            <div className={styles.profileText}>
            <div className={styles.imgBx}>
                {userPhoto ? (
                      <img src={`http://localhost:8080/${userPhoto}` } />
                    ) : (
                      <img src={avatar} alt="Profile" />
                    )}

                 
              
              
              
              </div>
             
                <span 
                  name="name" 
                  onBlur={handleChange} 
                  placeholder="Votre nom" 
                  className={styles.input}
                  contentEditable
                >{cvModel.name}</span>
             
                 <input
                    type="text"
                    value={cvModel.profession}
                    onChange={(e) => handleChange(e, 'profession')}
                    className={styles.input}
                    placeholder="profession"
                  />
            </div>
            <div className={styles.contactInfo}>
              <h3 className={styles.title}>Contact Info</h3>
              <ul>
                <li>
                  <span className={styles.icon}><i className="fa fa-phone" aria-hidden="true"></i></span>
                  <input
                    type="text"
                    value={cvModel.phone}
                    onChange={(e) => handleChange(e, 'phone')}
                    className={styles.input}
                    placeholder="telephone"
                  />
                </li>
                <li>
                  <span className={styles.icon}><i className="fa fa-envelope" aria-hidden="true"></i></span>
                  <input
                    type="text"
                    value={cvModel.email}
                    onChange={(e) => handleChange(e, 'email')}
                    className={styles.input}
                    placeholder="Email"
                  />
                </li>
                <li>
                  <span className={styles.icon}><i className="fa fa-globe" aria-hidden="true"></i></span>
                  <input
                    type="text"
                    value={cvModel.website}
                    onChange={(e) => handleChange(e, 'website')}
                    className={styles.input}
                    placeholder="siteweb "
                  />
                </li>
                <li>
                  <span className={styles.icon}><i className="fa fa-linkedin" aria-hidden="true"></i></span>
                  <input
                    type="text"
                    value={cvModel.linkedin}
                    onChange={(e) => handleChange(e, 'linkedin')}
                    className={styles.input}
                    placeholder="LinkedIn"
                  />
                </li>
                <li>
                  <span className={styles.icon}><i className="fa fa-map-marker" aria-hidden="true"></i></span>
                  <input
                    type="text"
                    value={cvModel.address}
                    onChange={(e) => handleChange(e, 'address')}
                    className={styles.input}
                    placeholder="Adresse"
                  />
                </li>
              </ul>
            </div>
            <div className={`${styles.contactInfo} ${styles.education}`}>
              <h3 className={styles.title}>EDUCATION</h3>
              <ul>
                          {cvModel.education.map((edu, index) => (
              <li key={index}>
                <input
                  type="date"
                  value={edu.startDate}  // Make sure this is provided
                  onChange={(e) => handleEducationChange(e, index, 'startDate')}
                  className={styles.input}
                  placeholder="Start Date"
                />
                <span className="text-gray-500 dark:text-gray-400">/</span>
                <input
                  type="date"
                  value={edu.endDate}  // Make sure this is provided
                  onChange={(e) => handleEducationChange(e, index, 'endDate')}
                  className={styles.input}
                  placeholder="End Date"
                />
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => handleEducationChange(e, index, 'degree')}
                  className={styles.input}
                  placeholder="Degree"
                />
                <input
                  type="text"
                  value={edu.institution}
                  onChange={(e) => handleEducationChange(e, index, 'institution')}
                  className={styles.input}
                  placeholder="Institution"
                />
              </li>
            ))}

              </ul>
              <div className={styles.buttonContainer}>
              <button className={styles.button} onClick={addEducation}>
                Ajouter plus d&lsquo;éducation
              </button>
        </div>
            </div>
            <div className={`${styles.contactInfo} ${styles.languages}`}>
              <h3 className={styles.title}>LANGUAGES</h3>
              <ul>
              {cvModel.languages.map((lang, index) => (
                      <div className={styles.box} key={index}>
                        <input
                          type="text"
                          value={lang.name}
                          onChange={(e) => handleChangeLanguageName(e, index)}
                          className={styles.input}
                          contentEditable
                        />
              <div className={styles.sliderContainer}>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={lang.proficiency}
                  onChange={(e) => {
                    const newLanguages = [...cvModel.languages];
                    newLanguages[index].proficiency = e.target.value;
                    setCvModel({ ...cvModel, languages: newLanguages });
                  }}
                  className={styles.slider}
                />
                <span>{lang.proficiency}%</span>
              </div>
            </div>
          ))}
          </ul>
            </div>
            <div className={styles.buttonContainer}>
            <button className={styles.button} onClick={addLanguage}>
              Ajouter plus de langues
            </button>
        </div>
          </div>
          {/* Partie droite */}
          <div className={styles.right_Side}>
            <div className={styles.about}>
              <h2 className={styles.title2}>Profile</h2>
              <textarea
                value={cvModel.profile}
                onChange={(e) => handleChange(e, 'profile')}
                className={styles.input}
                placeholder="Profile"
              />
            </div>
            <div className={styles.about}>
              <h2 className={styles.title2}>Experience</h2>
              {cvModel.experiences.map((exp, index) => (
                  <div className={styles.box} key={index}>
                    <div className={styles.year_company}>
                      <input
                        type="date"
                        value={exp.startDate}
                        onChange={(e) => handleExperienceChange(e, index, 'period.startDate')}
                        className={styles.input}
                        contentEditable
                        placeholder="Start Date"
                      />
                      <span className="text-gray-500 dark:text-gray-400">/</span>
                      <input
                        type="date"
                        value={exp.endDate}
                        onChange={(e) => handleExperienceChange(e, index, 'period.endDate')}
                        className={styles.input}
                        contentEditable
                        placeholder="End Date"
                      />
                      <input
                        type="text"
                        value={exp.companyName}
                        onChange={(e) => handleExperienceChange(e, index, 'companyName')}
                        className={styles.input}
                        contentEditable
                      />
                    </div>
                    <div className={styles.text}>
                      <input
                        type="text"
                        value={exp.jobTitle}
                        onChange={(e) => handleExperienceChange(e, index, 'jobTitle')}
                        className={styles.input}
                        contentEditable
                      />
                      <textarea
                        value={exp.description}
                        onChange={(e) => handleExperienceChange(e, index, 'description')}
                        className={styles.input}
                        placeholder="Description"
                      />
                    </div>
                  </div>
                ))}
                <div className={styles.buttonContainer}>
                <button className={styles.button} onClick={addExperience}>
                  Ajouter plus d&lsquo;expériences
                </button>
              </div>
            </div>
            <div className={`${styles.about} ${styles.skills}`}>
              <h2 className={styles.title2}>Professional Skills</h2>
              {cvModel.professionalSkills.map((skill, index) => (
                <div className={styles.box} key={index}>
                  <input
                    type="text"
                    value={skill.skillName}
                    onChange={(e) => handleSkillChange(e, index, 'skillName')}
                    className={styles.input}
                    contentEditable
                  />
                  <div className={styles.sliderContainer}>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={skill.proficiency}
                      onChange={(e) => handleSkillChange(e, index, 'proficiency')}
                      className={styles.slider}
                    />
                    <span>{skill.proficiency}%</span>
                  </div>
                </div>
              ))}
      <div className={styles.buttonContainer}>
                <button className={styles.button} onClick={addSkill}>
                  Ajouter plus de compétences
                </button>
              </div>        
              </div>
            <div className={styles.AboutInterest}>
              <h2 className={styles.title2}>Interest</h2>
              <ul contentEditable={true}>
                {cvModel.interests.map((interest, index) => (
                  <li key={index}><i className="fa fa-circle" aria-hidden="true"></i>{interest}</li>
                ))}
              </ul>
              <div className={styles.buttonContainer}>
              <button className={styles.button} onClick={addInterest}>
                Ajouter plus d&lsquo;intérêts
              </button>
            </div>
            </div>
          </div>
        </div>
    </div>
  );
}
export default ParentComponent;