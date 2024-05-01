import React, { useState, useEffect } from "react";
import Chat from "../chatbot";
import axios from "axios";
import styles from "./CVModel7.module.css";
import avatar from "../assets/cvprofile.jpeg";

const CVModel7 = () => {
  const [userId, setUserId] = useState(null);
  const [cvModel, setCvModel] = useState({
    name: "",
    prenom: "",
    job: "",
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

          setUserId(userId);
          setCvModel({
            name: userData.nom,
            prenom: userData.prenom,
            job: userData.jobTitle,
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
      case "question2": {// CONTACT_INFO
      const [phone, email, website, linkedin, address] = formationResponse.split(",").map(item => item.trim());
      updatedModel.phone = phone; // Mettre à jour le téléphone
      updatedModel.email = email; // Mettre à jour l'e-mail
      updatedModel.website = website; // Mettre à jour le site web
      updatedModel.linkedin = linkedin; // Mettre à jour le profil LinkedIn
      updatedModel.address = address; // Mettre à jour l'adresse
      break;
      }
      case "question3": {// EDUCATION
      const [period, degree, institution] = formationResponse.split(",").map(item => item.trim());
      const newEducation = { period, degree, institution };

      if (Array.isArray(cvModel.education)) {
        updatedModel.education = [...cvModel.education, newEducation];
      } else {
        updatedModel.education = [newEducation];
      }
      break;
    }
    case "question4": { // LANGUAGES
      const [language, proficiencyString] = formationResponse.split(":").map(item => item.trim());
      const proficiency = parseInt(proficiencyString); // Convertir la chaîne en nombre

      const newLanguage = {
        name: language,
        proficiency: proficiency || 50, // Utiliser 50 si aucun niveau n'est spécifié
      };

      if (Array.isArray(cvModel.languages)) {
        updatedModel.languages = [...cvModel.languages, newLanguage];
      } else {
        updatedModel.languages = [newLanguage];
      }
      break;
    }
      case "question5": // PROFILE
        updatedModel.profile = formationResponse; // Mettre à jour le profil
        break;
        case "question6": { // EXPÉRIENCE
          const [period, companyName,ville, jobTitle, description] = formationResponse.split("\n").map(item => item.trim());
          const newExperience = {
            period,
            companyName,
            ville,
            jobTitle,
            description,

          };
    
          if (Array.isArray(cvModel.experiences)) {
            updatedModel.experiences = [...cvModel.experiences, newExperience];
          } else {
            updatedModel.experiences = [newExperience];
          }
          break;
        }
    
      case "question7": { // COMPÉTENCES_PROFESSIONNELLES
        const [skillName, proficiencyString] = formationResponse.split(":").map(item => item.trim());
        const proficiency = parseInt(proficiencyString); // Convertir la chaîne en nombre
  
        const newSkill = {
          skillName,
          proficiency: proficiency || 50, // Utiliser 50 si aucun niveau n'est spécifié
        };
  
        if (Array.isArray(cvModel.professionalSkills)) {
          updatedModel.professionalSkills = [...cvModel.professionalSkills, newSkill];
        } else {
          updatedModel.professionalSkills = [newSkill];
        }
        break;
      }
  
        case "question8":{ // INTÉRÊTS
        const interests = formationResponse.split(",").map(item => item.trim());
      
        if (Array.isArray(cvModel.interests)) {
          updatedModel.interests = [...cvModel.interests, ...interests];
        } else {
          updatedModel.interests = interests;
        }
        break;
        }
        case "question9": {// FORMATION
          const [formationName, establishment, city, startDate, endDate, description] = formationResponse.split("\n").map(item => item.trim());
          const newFormation = {
            formationName,
            establishment,
            city,
            startDate,
            endDate,
            description,
          };
        
          if (Array.isArray(cvModel.formation)) {
            updatedModel.formation = [...cvModel.formation, newFormation];
          } else {
            updatedModel.formation = [newFormation];
          }
          break;
        }
        
      
      default:
        break;
    }
  
    setCvModel(updatedModel);
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
                <img src={avatar} alt="Profile" />
              </div>
              <h2>
                {cvModel.name} {cvModel.prenom}
                <br />
                <span>{cvModel.job}</span>
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
                {cvModel.education.map((edu, index) => (
                  <li key={index}>
                    <h5>{edu.period}</h5>
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
                {cvModel.experiences.map((exp, index) => (
                  <div className={styles.box} key={index}>
                    <div className={styles.year_company}>
                      <h5>{exp.period}</h5>
                      <h5>{exp.companyName}</h5>
                      <h5>{exp.ville}</h5>
                    </div>
                    <div className={styles.text}>
                      <h4>{exp.jobTitle}</h4>
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
                  <li key={index}>{interest}</li>
                ))}
              </ul>
            </div>
            <div className={styles.Aboutformation}>
              <h2 className={styles.title2}>FORMATION</h2>
              <ul>
               {cvModel.formation.map((formation, index) => (
                <div className={styles.box} key={index}>
                  <div className={styles.year_company}>
                    <h5>{formation.formationName} {formation.establishment} {formation.city}</h5>
                    <h5>{formation.startDate} - {formation.endDate}</h5>
                  </div>
                  <div className={styles.text}>
                    <p>{formation.description}</p>
                  </div>
                </div>
              ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVModel7;
