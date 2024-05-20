import React, { useState, useEffect } from "react";
import Chat from "../chatbot/chatbot";
import axios from "axios";
//import PropTypes from 'prop-types'; // Ajout de l'importation de PropTypes
import styles from "./CVModel7.module.css";
import avatar from "../assets/cvprofile.jpeg";
import { useNavigate } from "react-router-dom";


const CVModel7 = () => {
  const navigate = useNavigate();
  const [currentCVId,setCurrentCVId] = useState(null);

  const [userId, setUserId] = useState(null);
  const [userPhoto, setUserPhoto] = useState(null);
  const [cvModel, setCvModel] = useState({
    name: "",
    prenom: "",
    profession: "",
    phone: "",
    email: "",
    website: "",
    linkedin: "",
    address: "",
    education: [{ startDate: "", endDate: "", institution: "", degree: "" }],
    languages: [{ name: "", proficiency: "" }],
    profile: "",
    experiences: [{ startDate: "", endDate: "", ville: "", jobTitle: "", employeur: "", description: "" }],
    professionalSkills: [{ skillName: "", proficiency: "" }],
    interests: [],
  });
  
  

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axios
        .get("http://localhost:8080/current-username", { withCredentials: true })
        .then((response) => {
          const userData = response.data.user;
          const userId = userData.id || userData.user_id;
          setUserPhoto(response.data.user.photo);
          setUserId(userId);
          setCurrentCVId(userId);
          setCvModel({
            name: userData.nom,
            prenom: userData.prenom,
            profession: userData.profession,
            phone: userData.phone,
            email: userData.email,
            website: userData.website,
            linkedin: userData.linkedin,
            address: userData.address,
            education: [],
            languages: [],
            profile: "",
            experiences: [],
            professionalSkills: [],
            interests: [],
            photo: userData.photo,
          });
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des informations utilisateur:", error);
        });
    }
  }, [userId]);

  const updateUserResponse = (response, sectionKey, questionNumber) => {
    setCvModel((prevCvModel) => {
      const updatedModel = { ...prevCvModel };
  
      switch (sectionKey) {
        case "CONTACT INFO": {
          const contactInfoFields = ["phone", "email", "website", "linkedin", "address"];
          updatedModel[contactInfoFields[questionNumber - 1]] = response;
          break;
        }
        case "Education": {
          const educationFields = ["startDate", "endDate", "institution", "degree"];
          const fieldIndex = (questionNumber - 1) % educationFields.length;
  
          if (!Array.isArray(updatedModel.education)) {
            updatedModel.education = [];
          }
  
          // Si le champ actuel est "startDate", alors on commence une nouvelle entrée
          if (fieldIndex === 0) {
            updatedModel.education.push({});
          }
  
          // Met à jour la dernière entrée de la liste
          updatedModel.education[updatedModel.education.length - 1][educationFields[fieldIndex]] = response;
          break;
        }
        case "Experience": {
          const experienceFields = ["startDate", "endDate", "ville", "jobTitle", "employeur", "description"];
          const fieldIndex = (questionNumber - 1) % experienceFields.length;
  
          if (!Array.isArray(updatedModel.experiences)) {
            updatedModel.experiences = [];
          }
  
          // Si le champ actuel est "startDate", alors on commence une nouvelle entrée
          if (fieldIndex === 0) {
            updatedModel.experiences.push({});
          }
  
          // Met à jour la dernière entrée de la liste
          updatedModel.experiences[updatedModel.experiences.length - 1][experienceFields[fieldIndex]] = response;
          break;
        }
        case "LANGUAGES": {
          const languageFields = ["name", "proficiency"];
          const proficiency = parseInt(response);

          if (questionNumber % 2 === 1) {
            updatedModel.languages.push({ name: response, proficiency: "0" });
          } else {
            const lastIndex = updatedModel.languages.length - 1;
            updatedModel.languages[lastIndex][languageFields[1]] = proficiency;
          }
          break;
        }
        case "interets": {
          if (!Array.isArray(updatedModel.interests)) {
            updatedModel.interests = [];
          }
          updatedModel.interests = [...updatedModel.interests, response];
          break;
        }
        case "PROFILE": {
          updatedModel.profile = response;
          break;
        }
        case "competences professionnelles": {
          const skillFields = ["skillName", "proficiency"];
          const proficiency = parseInt(response);

          if (questionNumber % 2 === 1) {
            updatedModel.professionalSkills.push({ skillName: response, proficiency: "0" });
          } else {
            const lastIndex = updatedModel.professionalSkills.length - 1;
            updatedModel.professionalSkills[lastIndex][skillFields[1]] = proficiency;
          }
          break;
        }
        default:
          break;
      }
  
      return updatedModel;
    });
  };
  
  
  

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const validateAndFormatCVData = (cvModel) => {
    const formattedCVModel = { ...cvModel };
  
    // Assurez-vous que profile est une chaîne de caractères
    if (Array.isArray(formattedCVModel.profile)) {
      formattedCVModel.profile = formattedCVModel.profile.join(", ");
    }
  
    // Assurez-vous que toutes les dates sont présentes et au bon format
    formattedCVModel.education = formattedCVModel.education.map((edu) => {
      return {
        ...edu,
        period: {
          startDate: edu.startDate ? formatDate(edu.startDate) : undefined,
          endDate: edu.endDate ? formatDate(edu.endDate) : undefined,
        }
      };
    });
  
    formattedCVModel.experiences = formattedCVModel.experiences.map((exp) => {
      return {
        ...exp,
        period: {
          startDate: exp.startDate ? formatDate(exp.startDate) : undefined,
          endDate: exp.endDate ? formatDate(exp.endDate) : undefined,
        }
      };
    });
  
    return formattedCVModel;
  };
  
  const saveCVToServer = async () => {
    try {
      const formattedCVModel = validateAndFormatCVData(cvModel);
  
      const requiredFields = ['name', 'phone', 'email', 'address', 'profile'];
      const isEmptyField = requiredFields.some(field => !formattedCVModel[field]);
      if (isEmptyField) {
        alert('Veuillez remplir tous les champs obligatoires.');
        return;
      }
  
      const cvId = currentCVId;
      if (!cvId) {
        console.error('CV ID is undefined');
        return;
      }
  
      const response = await axios.post(`http://localhost:8080/cv/${userId}/${cvId}`, formattedCVModel);
      console.log('CV saved successfully:', response.data);
      const id = response.data.cvData._id;
      navigate(`/model7-user/${userId}/${cvId}/${id}`);
    } catch (error) {
      console.error('Error saving CV:', error);
    }
  };
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.leftPanel}>
        <Chat updateUserResponse={updateUserResponse} />
      </div>
      <div className={styles.rightPanel}>
        <div className={styles.container}>
          <div className={styles.left_Side}>
            <div className={styles.profileText}>
              <div className={styles.imgBx}>
                {userPhoto ? (
                  <img src={`http://localhost:8080/${userPhoto}`} />
                ) : (
                  <img src={avatar} alt="Profile" />
                )}
              </div>
              <h2>{cvModel.name} <br />{cvModel.prenom}<br /></h2>
            <h3>{cvModel.profession}</h3>       
            </div>
            <h3 className={styles.title}>CONTACT INFO</h3>
            <div className={styles.contactInfo}>
              <ul>
                <li>
                  <span className={styles.icon}>
                    <i className="fa fa-phone" aria-hidden="true"></i>
                  </span>
                  <span className={styles.text}>{cvModel.phone}</span>
                </li>
                <li>
                  <span className={styles.icon}>
                    <i className="fa fa-envelope" aria-hidden="true"></i>
                  </span>
                  <span className={styles.text}>{cvModel.email}</span>
                </li>
                <li>
                  <span className={styles.icon}>
                    <i className="fa fa-globe" aria-hidden="true"></i>
                  </span>
                  <span className={styles.text}>{cvModel.website}</span>
                </li>
                <li>
                  <span className={styles.icon}>
                    <i className="fa fa-linkedin" aria-hidden="true"></i>
                  </span>
                  <span className={styles.text}>{cvModel.linkedin}</span>
                </li>
                <li>
                  <span className={styles.icon}>
                    <i className="fa fa-map-marker" aria-hidden="true"></i>
                  </span>
                  <span className={styles.text}>{cvModel.address}</span>
                </li>
              </ul>
            </div>
            <div className={styles.education}>
              <h3 className={styles.title}>Education</h3>
              <ul>
                {cvModel.education?.map((edu, index) => (
                  <li key={index}>
                    <h5>
                      {edu.startDate ? formatDate(edu.startDate) : ""} -{" "}
                      {edu.endDate ? formatDate(edu.endDate) : ""}
                    </h5>
                    <h4>{edu.degree}</h4>
                    <h4>{edu.institution}</h4>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.languages}>
              <h3 className={styles.title}>LANGUAGES</h3>
              <ul>
                {cvModel.languages && cvModel.languages.map((lang, index) => (
                  <li key={index}>
                    <span className={styles.text}>{lang.name}</span>
                    <div className={styles.progressBar}>
                      <div className={styles.progress} style={{ width: `${lang.proficiency}%` }}></div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className={styles.right_Side}>
            <div className={styles.about}>
              <h2 className={styles.title2}>Profile</h2>
              <p>{cvModel.profile}</p>
            </div>
            <div className={styles.experiences}>
              <h2 className={styles.title2}>Experience</h2>
              {cvModel.experiences?.map((exp, index) => (
                <div className={styles.box} key={index}>
                  <div className={styles.year_company}>
                    <h5>
                      {exp.startDate ? formatDate(exp.startDate) : ""} -{" "}
                      {exp.endDate ? formatDate(exp.endDate) : ""}
                    </h5>
                    <h5>{exp.ville}</h5>
                  </div>
                  <div className={styles.text}>
                    <h4>{exp.jobTitle}</h4>
                    <h4>{exp.employeur}</h4>
                    <p>{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.professional_skills}>
              <h2 className={styles.title2}>Compétences Professionnelles</h2>
              <div className={styles.skills}>
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
                {cvModel.interests?.map((interest, index) => (
                  <li key={index}>{interest}</li>
                ))}
              </ul>
            </div>

            
          </div>
        </div>
      </div>
      <button onClick={saveCVToServer} className={styles.finishButton}>
        Sauvegarder le cv
      </button>
    </div>
  );
};

export default CVModel7;
