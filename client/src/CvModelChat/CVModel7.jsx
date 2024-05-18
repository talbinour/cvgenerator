import React, { useState, useEffect } from "react";
import Chat from "../chatbot";
import axios from "axios";
import styles from "./CVModel7.module.css";
import avatar from "../assets/cvprofile.jpeg";
import { useNavigate } from "react-router-dom";

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
    education: [{}],
    languages: [{}],
    profile: "",
    experiences: [{}],
    professionalSkills: [{}],
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
          setCvModel({
            name: userData.nom,
            prenom: userData.prenom,
            profession: userData.profession,
            phone: userData.phone,
            email: userData.email,
            website: userData.website,
            linkedin: userData.linkedin,
            address: userData.address,
            education: [{}],
            languages: [{}],
            profile: "",
            experiences: [{}],
            professionalSkills: [{}],
            interests: [],
            photo: userData.photo,
          });
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des informations utilisateur:", error);
        });
    }
  }, [userId]);

  const updateUserResponse = (response, sectionKey) => {
    setCvModel((prevCvModel) => {
      const updatedModel = { ...prevCvModel };
  
      // Mettre à jour le modèle de CV en fonction de la sectionKey
      if (sectionKey === "Contact Info") {
        // Mettre à jour les informations de contact appropriées
        updatedModel[response.field] = response.value;
      } else if (sectionKey === "Education") {
        // Mettre à jour les détails de l'éducation
        if (!updatedModel.education) {
          updatedModel.education = [];
        }
        updatedModel.education.push(response);
      } else if (sectionKey === "Languages") {
        // Mettre à jour les compétences linguistiques
        if (!updatedModel.languages) {
          updatedModel.languages = [];
        }
        updatedModel.languages.push(response);
      } else if (sectionKey === "Interests") {
        // Mettre à jour les intérêts
        updatedModel.interests.push(response);
      } else if (sectionKey === "Professional Skills") {
        // Mettre à jour les compétences professionnelles
        if (!updatedModel.professionalSkills) {
          updatedModel.professionalSkills = [];
        }
        updatedModel.professionalSkills.push(response);
      }
  
      return updatedModel;
    });
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
                {cvModel.education?.map((edu, index) => (
                  <li key={index}>
                    <h5>{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</h5>
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
                    <span className={styles.percent}>
                      <div style={{ width: lang.proficiency }}></div>
                    </span>
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
                    <h5>{formatDate(exp.startDate)} - {formatDate(exp.endDate)}</h5>
                    <h5>{exp.ville}</h5>
                    <h5>{exp.jobTitle} at {exp.employeur}</h5>
                  </div>
                  <div className={styles.text}>
                    <p>{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.skills}>
              <h2 className={styles.title2}>Professional Skills</h2>
              {cvModel.professionalSkills?.map((skill, index) => (
                <div className={styles.box} key={index}>
                  <h4>{skill.skillName}</h4>
                  <div className={styles.percent}>
                    <div style={{ width: skill.proficiency }}></div>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.interests}>
              <h2 className={styles.title2}>Interests</h2>
              <ul>
                {cvModel.interests.map((interest, index) => (
                  <li key={index}>
                    <span className={styles.icon}>
                      <i className="fa fa-star" aria-hidden="true"></i>
                    </span>
                    <span className={styles.text}>{interest}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button className={styles.saveButton} onClick={saveCVToServer}>
              Terminer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVModel7;
