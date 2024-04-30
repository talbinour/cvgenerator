import React, { useState, useEffect } from "react";
import Chat from "../chatbot";
import axios from "axios";
import styles from "./CVModel7.module.css";

const CVModel7 = () => {
  const [userId, setUserId] = useState(null);
  const [cvTitle, setCvTitle] = useState("Mon CV");
  const [cvModel, setCvModel] = useState({
    name: '',
    jobTitle: '',
    phone: '',
    email: '',
    website: '',
    linkedin: '',
    address: '',
    education: [],
    languages: [],
    profile: '',
    experiences: [],
    professionalSkills: [],
    interests: ['', '', '', '']
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
          setCvModel((prevState) => ({
            ...prevState,
            name: userData.nom || '',
            prenom: userData.prenom || '',
            job: userData.jobTitle || '',
            phone: userData.phone || '',
            email: userData.email || '',
            website: userData.website || '',
            linkedin: userData.linkedin || '',
            address: userData.address || '',
          }));
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des informations utilisateur:", error);
        });
    }
  }, [userId]);

  const updateContactInfo = (response) => {
    const [phone, email, website, linkedin, address] = response.split(",");
    setCvModel((prevState) => ({
      ...prevState,
      phone: phone.trim(),
      email: email.trim(),
      website: website.trim(),
      linkedin: linkedin.trim(),
      address: address.trim(),
    }));
  };

  const updateEducation = (response) => {
    const educationData = response.split(";").map((item, index) => ({
      id: index + 1,
      period: item.trim(),
      degree: "",
      institution: "",
    }));

    setCvModel((prevState) => ({
      ...prevState,
      education: educationData,
    }));
  };

  const updateLanguages = (response) => {
    const languagesData = response.split(",").map((item, index) => ({
      id: index + 1,
      name: item.trim(),
      proficiency: 0,
    }));

    setCvModel((prevState) => ({
      ...prevState,
      languages: languagesData,
    }));
  };

  const updateTitleContent = (response) => {
    const newTitle = response.trim();
    setCvTitle(newTitle);
  };

  const updateUserResponse = (question, response) => {
    switch (question) {
      case "Quel est votre numéro de téléphone ?":
      case "Quelle est votre adresse e-mail ?":
      case "Quel est l'URL de votre site web ?":
      case "Quel est votre profil LinkedIn ?":
      case "Dans quel pays êtes-vous basé(e) ?":
        updateContactInfo(response);
        break;
      case "Où avez-vous étudié ?":
      case "Quel est le nom de votre école/université ?":
      case "Pouvez-vous préciser la période de temps de vos études ?":
        updateEducation(response);
        break;
      case "Quelles langues parlez-vous ?":
        updateLanguages(response);
        break;
      case "Pouvez-vous nous parler un peu de vous ?":
        setCvModel((prevState) => ({
          ...prevState,
          profile: response.trim(),
        }));
        break;
      default:
        break;
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.leftPanel}>
        <Chat updateTitleContent={updateTitleContent} updateUserResponse={updateUserResponse} setCvModel={setCvModel} />
      </div>
      <div className={styles.rightPanel}>
        <div className={styles.container}>
          <div className={styles.contactInfo}>
            <h2>{cvTitle}</h2>
            <h3>CONTACT INFO</h3>
            <ul>
              <li><strong>Téléphone:</strong> {cvModel.phone}</li>
              <li><strong>Email:</strong> {cvModel.email}</li>
              <li><strong>Site Web:</strong> {cvModel.website}</li>
              <li><strong>LinkedIn:</strong> {cvModel.linkedin}</li>
              <li><strong>Adresse:</strong> {cvModel.address}</li>
            </ul>
          </div>
          <div className={styles.education}>
            <h3>ÉDUCATION</h3>
            <ul>
              {cvModel.education && cvModel.education.map((edu, index) => (
                <li key={index}>
                  <span>{edu.period}</span>
                  <span>{edu.degree}</span>
                  <span>{edu.institution}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.profile}>
            <h3>PROFIL</h3>
            <p>{cvModel.profile}</p>
          </div>
          <div className={styles.experience}>
            <h3>EXPÉRIENCE</h3>
            <ul>
              {cvModel.experiences && cvModel.experiences.map((experience, index) => (
                <li key={index}>
                  <span>{experience.period}</span>
                  <span>{experience.companyName}</span>
                  <span>{experience.jobTitle}</span>
                  <span>{experience.description}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.skills}>
            <h3>COMPÉTENCES PROFESSIONNELLES</h3>
            <ul>
              {cvModel.professionalSkills && cvModel.professionalSkills.map((skill, index) => (
                <li key={index}>
                  <span>{skill.skillName}</span>
                  <span>{skill.proficiency}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.languages}>
            <h3>LANGUES</h3>
            <ul>
              {cvModel.languages && cvModel.languages.map((language, index) => (
                <li key={index}>
                  <span>{language.name}</span>
                  <span>{language.proficiency}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.interests}>
            <h3>INTÉRÊTS</h3>
            <ul>
              {cvModel.interests && cvModel.interests.map((interest, index) => (
                <li key={index}>{interest}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVModel7;
