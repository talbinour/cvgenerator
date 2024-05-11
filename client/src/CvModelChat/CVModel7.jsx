import React, { useState, useEffect } from "react";
import Chat from "../chatbot";
import axios from "axios";
import styles from "./CVModel7.module.css";
import avatar from "../assets/cvprofile.jpeg";
import {  useNavigate } from "react-router-dom";

const CVModel7 = () => {
 const navigate = useNavigate();
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
    education: [],
    languages: [],
    profile: "",
    experiences: [],
    professionalSkills: [],
    interests: [],
    formation: [],
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
         // setCurrentCVId(userId);
          setUserId(userId);
          setCvModel({
            name: userData.nom,
            prenom: userData.prenom,
            profession:userData.profession,
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
            formation: [],
            photo:userData.photo
          });
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des informations utilisateur:", error);
        });
    }
  }, [userId]);

  const updateTitleContent = (title, content) => {
    switch (title) {
      case "CONTACT_INFO":
        setCvModel(prevState => ({
          ...prevState,
          phone: content.phone || prevState.phone,
          email: content.email || prevState.email,
          website: content.website || prevState.website,
          linkedin: content.linkedin || prevState.linkedin,
          address: content.address || prevState.address
        }));
        break;
      case "FORMATION":
        setCvModel(prevState => ({
          ...prevState,
          formation: [
            ...prevState.formation,
            {
              formationName: content.formationName || "",
              establishment: content.establishment || "",
              city: content.city || "",
              startDate: content.startDate || "",
              endDate: content.endDate || "",
              description: content.description || ""
            }
          ]
        }));
        break;
      case "EXPÉRIENCE":
        setCvModel(prevState => ({
          ...prevState,
          experiences: [
            ...prevState.experiences,
            {
              period: content.period || "",
              companyName: content.companyName || "",
              jobTitle: content.jobTitle || "",
              description: content.description || ""
            }
          ]
        }));
        break;
      case "COMPÉTENCES_PROFESSIONNELLES":
        setCvModel(prevState => ({
          ...prevState,
          professionalSkills: [
            ...prevState.professionalSkills,
            {
              skillName: content.skillName || "",
              proficiency: 50 // Modifier la valeur de proficiency selon vos besoins
            }
          ]
        }));
        break;
      case "INTÉRÊTS":
        setCvModel(prevState => ({
          ...prevState,
          interests: [
            ...prevState.interests,
            content || ""
          ]
        }));
        break;
      case "LANGUAGES":
        setCvModel(prevState => ({
          ...prevState,
          languages: [
            ...prevState.languages,
            {
              name: content.name || "",
              proficiency: 50 // Modifier la valeur de proficiency selon vos besoins
            }
          ]
        }));
        break;
      case "PROFILE":
        setCvModel(prevState => ({
          ...prevState,
          profile: content || prevState.profile
        }));
        break;
      default:
        break;
    }
  };

  
  
  

  const updateUserResponse = (formationResponse, nextQuestionKey) => {
    const updatedModel = { ...cvModel };
  
    switch (nextQuestionKey) {
      case "question2": // CONTACT_INFO
      updatedModel.phone = formationResponse; // Mettre à jour le téléphone
      break;
    case "question3": // CONTACT_INFO
      updatedModel.email = formationResponse; // Mettre à jour l'e-mail
      break;
    case "question4": // CONTACT_INFO
      updatedModel.website = formationResponse; // Mettre à jour le site web
      break;
    case "question5": // CONTACT_INFO
      updatedModel.linkedin = formationResponse; // Mettre à jour LinkedIn
      break;
    case "question6": // CONTACT_INFO
      updatedModel.address = formationResponse; // Mettre à jour l'adresse
      break;
    case "question7": { // EDUCATION
        const newEducation = {
            ...updatedModel.education[0], // Copy the existing education entry
            period: {
                ...updatedModel.education[0]?.period, // Copy the existing period
                startDate: formationResponse // Update the start date with user's response
            }
            
        };
        updatedModel.education[0] = newEducation; // Update the first education entry with the modified period
        break;
    }
    
    
    case "question8": { // EDUCATION
      const newEducation = {
        ...updatedModel.education[0], // Copy the existing education entry
        period: {
            ...updatedModel.education[0]?.period, // Copy the existing period
            endDate: formationResponse // Update the start date with user's response
        }
        
    };
    updatedModel.education[0] = newEducation; // Update the first education entry with the modified period
    break;
  }
  
    
    case "question9": { // EDUCATION
        updatedModel.education[0].degree = formationResponse; // Update the degree of the first education entry
        break;
    }
    
    case "question10": { // EDUCATION
        updatedModel.education[0].institution = formationResponse; // Update the institution of the first education entry
        break;
    }
    case "question11": { // LANGUAGES
      updatedModel.languages[0] = {
        ...updatedModel.languages[0],
        name:formationResponse
      };
       
        
        
      break;
    }
    case "question12": { // LANGUAGES    
      if (updatedModel.languages.length > 0) {
        updatedModel.languages[0] = {
          ...updatedModel.languages[0],
          proficiency: formationResponse
        };
      } else {
        updatedModel.languages = [{
          name: "",
          proficiency: formationResponse
        }];
      }
      break;
    }
    
    
    
      case "question13": // PROFILE
        updatedModel.profile = formationResponse; // Mettre à jour le profil
        break;
        case "question14": { // EXPÉRIENCE
          const newExperience = {
              ...updatedModel.experiences[0], // Copiez l'entrée d'expérience existante
              period: {
                  ...updatedModel.experiences[0]?.period, // Copiez la période existante
                  startDate: formationResponse // Mettez à jour la date de début avec la réponse de l'utilisateur
              }
          };
          updatedModel.experiences[0] = newExperience; // Mettez à jour la première entrée d'expérience avec la période modifiée
          break;
      }
        case "question15": { // EXPÉRIENCE
          const newExperience = {
            ...updatedModel.experiences[0], // Copiez l'entrée d'expérience existante
            period: {
                ...updatedModel.experiences[0]?.period, // Copiez la période existante
                endDate: formationResponse // Mettez à jour la date de début avec la réponse de l'utilisateur
            }
        };
        updatedModel.experiences[0] = newExperience; // Mettez à jour la première entrée d'expérience avec la période modifiée
        break;
    }
        case "question16": { // EXPÉRIENCE
          updatedModel.experiences[0].ville= formationResponse; 
          break;// Update the degree of the first education entry

        }
        case "question17": { // EXPÉRIENCE
          updatedModel.experiences[0].jobTitle= formationResponse; 
          break;// Update the degree of the first education entry

        }
        case "question18": { // EXPÉRIENCE
          updatedModel.experiences[0].employeur= formationResponse; 
          break;// Update the degree of the first education entry

        }
        case "question19": { // EXPÉRIENCE
          if (updatedModel.experiences.length > 0) {
            updatedModel.experiences[0] = {
              ...updatedModel.experiences[0],
              description: formationResponse
            };
          } else {
            updatedModel.experiences = [{
              description: formationResponse
            }];
          }
          break;
        }
        

        case "question20": { // COMPÉTENCES_PROFESSIONNELLES
          updatedModel.professionalSkills[0] = {
            ...updatedModel.professionalSkills[0], // Spread the existing professional skill object
            skillName: formationResponse // Update the name property with the user's response
          };
          break;
        }
        
        case "question21": { // COMPÉTENCES_PROFESSIONNELLES
          if (updatedModel.professionalSkills.length > 0) {
            updatedModel.professionalSkills[0] = {
              ...updatedModel.professionalSkills[0],
              proficiency: formationResponse // Update the proficiency property with the user's response
            };
          } else {
            updatedModel.professionalSkills = [{
              name: "", // Set default name
              proficiency: formationResponse // Set proficiency with user's response
            }];
          }
          break;
        }
        

        case "question22": { // INTÉRÊTS
          if (updatedModel.interests.length > 0) {
            updatedModel.interests[0] = formationResponse; // Update the institution of the first education entry
          } else {
            updatedModel.interests = [formationResponse]; // Initialize the interests array with the first value
          }
          break;
        }
        
      
      default:
        break;
    }
  
    setCvModel(updatedModel);
  };
  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  const saveCVToServer = async () => {
    try {
      const response = await axios.post(`http://localhost:8080/cv/${userId}/`, cvModel);
      console.log('New CV Data:', response.data);
      navigate("/model7-user");
    } catch (error) {
      console.error('Error creating CV:', error);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.leftPanel}>
   <Chat updateTitleContent={updateTitleContent} updateUserResponse={(formationResponse, nextQuestionKey) => updateUserResponse(formationResponse, nextQuestionKey)} />
      </div>
      <div className={styles.rightPanel}> 
       
        <div className={styles.container}>
          <div className={styles.left_Side}>
            <div className={styles.profileText}>
            <div className={styles.imgBx}>
            {userPhoto ? (
                  <img src={`http://localhost:8080/${userPhoto}` } />
                ) : (
                  <img src={avatar} alt="Profile" />
                )}                 
              </div>
              <h2>
                {cvModel.name} {cvModel.prenom}
                <br />
                <span>{cvModel.profession}</span>
              </h2>
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
              <h3 className={styles.title}>EDUCATION</h3>
              <ul>
              {cvModel.education && cvModel.education.map((edu, index) => (
                <li key={index}>
                  <h5>{formatDate(edu.period && edu.period.startDate)} - {formatDate(edu.period && edu.period.endDate)}</h5>
                  <h4>{edu.degree}</h4>
                  <h4>{edu.institution}</h4>
                </li>
              ))}



              </ul>
            </div>
            <div className={styles.languages}>
              <h3 className={styles.title}>LANGUAGES</h3>
              <ul>
              {cvModel.languages?.map((lang, index) => (
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
              <h2 className={styles.title2}>PROFILE</h2>
              <p>{cvModel.profile}</p>
            </div>
            <div className={styles.about}>
              <h2 className={styles.title2}>Expérience</h2>
              <div className={styles.box}>
                <div className={styles.year_company}>
                  <h5></h5>
                  <h5></h5>
                </div>
                <div className={styles.text}>
                {cvModel.experiences?.map((exp, index) => (
                    <div className={styles.box} key={index}>
                      <div className={styles.year_company}>
                        <h5>{formatDate(exp.period && exp.period.startDate)} - {formatDate(exp.period && exp.period.endDate)}</h5>
                        <h5>{exp.ville}</h5>
                        <h5>{exp.jobTitle}</h5>
                      </div>
                      <div className={styles.text}>
                        <h4>{exp.employeur}</h4>
                        <p>{exp.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className={`${styles.about} ${styles.skills}`}>
              <h2 className={styles.title2}>Compétences Professionnelles</h2>
              <div className={styles.skillContainer}>
              {cvModel.professionalSkills?.map((skill, index) => (
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
      <button className={styles.finishButton} onClick={saveCVToServer} >Terminer</button>
    </div>
  );
};

export default CVModel7;
