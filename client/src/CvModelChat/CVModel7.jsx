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
    let newEducation, newLanguage, newExperience, newSkill;
    switch (title) {
      case "Quel est votre numéro de téléphone ?":
        setCvModel((prevState) => ({ ...prevState, contactInfo: { ...prevState.contactInfo, phone: content } }));
        break;
      case "Quelle est votre adresse e-mail ?":
        setCvModel((prevState) => ({ ...prevState, contactInfo: { ...prevState.contactInfo, email: content } }));
        break;
      // Autres cas...
      case "Où avez-vous étudié ?":
        newEducation = {
          formationName: content,
          establishment: content,
          city: content,
          startDate: content,
          endDate: content,
          description: content,
        };
        setCvModel((prevState) => ({ ...prevState, formation: [...prevState.formation, newEducation] }));
        break;
      case "Quelles langues parlez-vous et à quel niveau ?":
        newLanguage = {
          name: content,
          proficiency: 50, // Modifier la valeur de proficiency selon vos besoins
        };
        setCvModel((prevState) => ({ ...prevState, languages: [...prevState.languages, newLanguage] }));
        break;
      // Autres cas...
      default:
        break;
    }
  };

  const updateUserResponse = (formationResponse) => {
    let newFormation, newEducation, newContactInfo, newLanguage, newSkill, newExperience;
    // Mise à jour des intérêts
    // Autres mises à jour...

    // Mise à jour de la formation
    newFormation = {
      formationName: "", // Remplacer par la valeur correspondante
      establishment: "", // Remplacer par la valeur correspondante
      city: "", // Remplacer par la valeur correspondante
      startDate: "", // Remplacer par la valeur correspondante
      endDate: "", // Remplacer par la valeur correspondante
      description: "", // Remplacer par la valeur correspondante
    };
    // Autres mises à jour...

    // Mise à jour de l'éducation
    newEducation = {
      period: formationResponse,
      degree: formationResponse,
      institution: formationResponse,
    };
    // Autres mises à jour...

    // Mise à jour des informations de contact
    newContactInfo = {
      phone: formationResponse,
      email: formationResponse,
      website: formationResponse,
      linkedin: formationResponse,
      address: formationResponse,
    };
    // Autres mises à jour...

    // Mise à jour des langues
    newLanguage = {
      name: formationResponse,
      proficiency: 50, // Modifier la valeur de proficiency selon vos besoins
    };
    // Autres mises à jour...

    // Mise à jour des compétences professionnelles
    newSkill = {
      skillName: formationResponse,
      proficiency: 50, // Modifier la valeur de proficiency selon vos besoins
    };
    // Autres mises à jour...

    // Mise à jour de l'expérience
    newExperience = {
      period: formationResponse,
      companyName: formationResponse,
      jobTitle: formationResponse,
      description: formationResponse,
    };
    // Autres mises à jour...
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.leftPanel}>
        <Chat updateTitleContent={updateTitleContent} updateUserResponse={updateUserResponse} />
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
                    <h4>{edu.formationName}</h4>
                    <p>
                      <span>{edu.city}</span>, <span>{edu.startDate}</span> - <span>{edu.endDate}</span>
                    </p>
                    <p>{edu.description}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.languages}>
              <h3 className={styles.title}>LANGUAGES</h3>
              <ul>
                {cvModel.languages.map((language, index) => (
                  <li key={index}>
                    <h4>{language.name}</h4>
                    <p>Proficiency: {language.proficiency}%</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className={styles.right_Side}>
            <div className={styles.experience}>
              <h3 className={styles.title}>EXPERIENCE</h3>
              <ul>
                {cvModel.experiences.map((experience, index) => (
                  <li key={index}>
                    <h4>{experience.jobTitle}</h4>
                    <p>
                      <span>{experience.companyName}</span>, <span>{experience.period}</span>
                    </p>
                    <p>{experience.description}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.skills}>
              <h3 className={styles.title}>PROFESSIONAL SKILLS</h3>
              <ul>
                {cvModel.professionalSkills.map((skill, index) => (
                  <li key={index}>
                    <h4>{skill.skillName}</h4>
                    <p>Proficiency: {skill.proficiency}%</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.interests}>
              <h3 className={styles.title}>INTERESTS</h3>
              <ul>
                {cvModel.interests.map((interest, index) => (
                  <li key={index}>
                    <p>{interest}</p>
                  </li>
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
