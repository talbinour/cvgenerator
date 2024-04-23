import React, { useState, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.css';
import avatar from '../assets/cvprofile.jpeg';
import styles from './edit.module.css';
import axios from 'axios'; 
import CvOrResume from './model7';
import {  useNavigate } from "react-router-dom";

//import { Link } from 'react-router-dom';
const ParentComponent = () => {
  const navigate = useNavigate();
  const [currentCVId, setCurrentCVId] = useState(null);
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
    address: '56th street, California',
    education: [
      { id: 1, period: '2017 - 2019', degree: 'Matric in Science', institution: 'School Name' },
      { id: 2, period: '2019 - 2021', degree: 'Intermediate in Maths', institution: 'College Name' },
      { id: 3, period: '2021 - Now', degree: 'Undergraduate in Computer Science', institution: 'University Name' }
    ],
    languages: [
      { id: 1, name: 'English', proficiency: 90 },
      { id: 2, name: 'Urdu', proficiency: 80 }
    ],
    profile: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Porro exercitationem nesciunt, tenetur architecto omnis maxime delectus quae quo reprehenderit quas laudantium. Itaque sequi commodi vero suscipit reiciendis ea aspernatur cum. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Porro exercitationem nesciunt, tenetur architecto omnis maxime delectus quae quo reprehenderit quas laudantium. Itaque sequi commodi vero suscipit reiciendis ea aspernatur cum.',
    experiences: [
      { id: 1, period: '2019 - 2021', companyName: 'Company A', jobTitle: 'Senior Web Developer', description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Porro exercitationem nesciunt, tenetur architecto omnis' },
      { id: 2, period: '2021 - present', companyName: 'Company B', jobTitle: 'Data Analyst', description: 'Lorem ipsum,dolor sit amet consectetur adipisicing elit. Porro exercitationem nesciunt,tenetur architecto omnis' }
    ],
    professionalSkills: [
      { id: 1, skillName: 'HTML', proficiency: 95 },
      { id: 2, skillName: 'CSS', proficiency: 70 },
      { id: 3, skillName: 'JavaScript', proficiency: 95 },
      { id: 4, skillName: 'Python', proficiency: 75 }
    ],
    interests: ['Trading', 'Developing', 'Gaming', 'Business']
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

              setUserId(userId);
              setCurrentCVId(userId); // Set currentCVId with userId
              setCvModel({
                ...cvModel,
                name: userData.nom,
                jobTitle: userData.prenom,
                phone: userData.Nbphone,
                email: userData.email,
                address: userData.pays,
                // Assuming other properties are similar
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
        console.error('CV ID is undefined');
        return;
      }

      const response = await axios.get(`http://localhost:8080/cv/${userId}/${cvId}`);
      setCvModel(response.data.cvData);
    } catch (error) {
      console.error('Error loading CV:', error);
    }
  };

  const saveCVToServer = async () => {
    try {
      const cvId = getCurrentCVId();
      if (!cvId) {
        console.error('CV ID is undefined');
        return;
      }

      const response = await axios.put(`http://localhost:8080/cv/${userId}/${cvId}`, cvModel);
      console.log('CV saved successfully:', response.data);
      navigate("/model7-user");

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
    newExperiences[index][field] = e.target.value;
    setCvModel({ ...cvModel, experiences: newExperiences });
  };

  const handleSkillChange = (e, index, field) => {
    const newSkills = [...cvModel.professionalSkills];
    newSkills[index][field] = e.target.value;
    setCvModel({ ...cvModel, professionalSkills: newSkills });
  };

  const handleEducationChange = (e, index, field) => {
    const newEducation = [...cvModel.education];
    newEducation[index][field] = e.target.value;
    setCvModel({ ...cvModel, education: newEducation });
  };
  if (!cvModel) {
    return <CvOrResume />;
  }
  return (
    <div className={`${styles['print-area']} ${styles.resume}`}>
        <div   className={styles.container}>
        <div className={styles.editButton}>
            <button onClick={saveCVToServer}><i className="fas fa-save"></i> Terminer</button>
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
                  <input
                    type="text"
                    value={cvModel.phone}
                    onChange={(e) => handleChange(e, 'phone')}
                    className={styles.input}
                    placeholder="Phone"
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
                    placeholder="Website"
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
                    placeholder="Address"
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
                      type="text"
                      value={edu.period}
                      onChange={(e) => handleEducationChange(e, index, 'period')}
                      className={styles.input}
                      contentEditable
                    />
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => handleEducationChange(e, index, 'degree')}
                      className={styles.input}
                      contentEditable
                    />
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => handleEducationChange(e, index, 'institution')}
                      className={styles.input}
                      contentEditable
                    />
                  </li>
                ))}
              </ul>
            </div>
            <div className={`${styles.contactInfo} ${styles.languages}`}>
              <h3 className={styles.title}>LANGUAGES</h3>
              <ul>
                {cvModel.languages && cvModel.languages.map((lang, index) => (
                  <li key={index}>
                    <input
                      type="text"
                      value={lang.name}
                      onChange={(e) => handleChangeLanguageName(e, index)}
                      className={styles.input}
                      contentEditable
                    />
                    <div className={styles.percentContainer}>
                      <input
                        type="number"
                        value={lang.proficiency}
                        onChange={(e) => {
                          const newLanguages = [...cvModel.languages];
                          newLanguages[index].proficiency = e.target.value;
                          setCvModel({ ...cvModel, languages: newLanguages });
                        }}
                        className={styles.input}
                      />
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
                      type="text"
                      value={exp.period}
                      onChange={(e) => handleExperienceChange(e, index, 'period')}
                      className={styles.input}
                      contentEditable
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
                  <div className={styles.percent}>
                    <input
                      type="number"
                      value={skill.proficiency}
                      onChange={(e) => handleSkillChange(e, index, 'proficiency')}
                      className={styles.input}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.AboutInterest}>
              <h2 className={styles.title2}>Interest</h2>
              <ul contentEditable={true}>
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

export default ParentComponent;
