import React, { useState, useEffect } from "react";
import Chat from "../chatbot/chatbot";
import axios from "axios";
import PropTypes from 'prop-types'; // Ajout de l'importation de PropTypes
import styles from "./CVModel7.module.css";
import avatar from "../assets/cvprofile.jpeg";
import { useNavigate } from "react-router-dom";

// Définition du composant Slider intégré
const Slider = ({ value, onChange }) => {
  return (
    <input
      type="range"
      min="0"
      max="100"
      value={value}
      onChange={onChange}
      className={styles.slider}
    />
  );
};

// Ajout des propTypes pour le composant Slider
Slider.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
};

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
    education: [{ startDate: "", endDate: "", institution: "", degree: "" }],
    languages: [{ name: "", proficiency: "0" }],
    profile: "",
    experiences: [{ startDate: "", endDate: "", ville: "", jobTitle: "", employeur: "", description: "" }],
    professionalSkills: [{ skillName: "", proficiency: "0" }],
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
            education: [{ startDate: "", endDate: "", institution: "", degree: "" }],
            languages: [{ name: "", proficiency: "0" }],
            profile: "",
            experiences: [{ startDate: "", endDate: "", ville: "", jobTitle: "", employeur: "", description: "" }],
            professionalSkills: [{ skillName: "", proficiency: "0" }],
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
          const educationIndex = Math.floor((questionNumber - 1) / educationFields.length);
          const fieldIndex = (questionNumber - 1) % educationFields.length;

          if (!updatedModel.education[educationIndex]) {
            updatedModel.education.push({});
          }
          updatedModel.education[educationIndex][educationFields[fieldIndex]] = response;
          break;
        }
        case "Experience": {
          const experienceFields = ["startDate", "endDate", "ville", "jobTitle", "employeur", "description"];
          const experienceIndex = Math.floor((questionNumber - 1) / experienceFields.length);
          const fieldIndex = (questionNumber - 1) % experienceFields.length;

          if (!updatedModel.experiences[experienceIndex]) {
            updatedModel.experiences.push({});
          }
          updatedModel.experiences[experienceIndex][experienceFields[fieldIndex]] = response;
          break;
        }
        case "LANGUAGES": {
          const languageIndex = Math.floor((questionNumber - 1) / 2);
          const isProficiency = questionNumber % 2 === 0;

          if (!updatedModel.languages[languageIndex]) {
            updatedModel.languages.push({ name: "", proficiency: "0" });
          }

          if (isProficiency) {
            updatedModel.languages[languageIndex].proficiency = response;
          } else {
            updatedModel.languages[languageIndex].name = response;
          }
          break;
        }
        case "interets": {
          if (!Array.isArray(updatedModel.interests)) {
            updatedModel.interests = [];
          }
          if (!updatedModel.interests.includes(response)) {
            updatedModel.interests.push(response);
          }
          break;
        }
        case "PROFILE": {
          if (!Array.isArray(updatedModel.profile)) {
            updatedModel.profile = [];
          }
          updatedModel.profile.push(response);
          break;
        }
        case "competences professionnelles": {
          const skillIndex = Math.floor((questionNumber - 1) / 2);
          const isProficiency = questionNumber % 2 === 0;
  
          if (!updatedModel.professionalSkills[skillIndex]) {
            updatedModel.professionalSkills.push({ skillName: "", proficiency: "0" });
          }
  
          if (isProficiency) {
            updatedModel.professionalSkills[skillIndex].proficiency = response;
          } else {
            updatedModel.professionalSkills[skillIndex].skillName = response;
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

  const saveCVToServer = async () => {
    try {
      const response = await axios.post(`http://localhost:8080/cv/${userId}/`, cvModel);
      console.log("New CV Data:", response.data);
      navigate("/model7-user");
    } catch (error) {
      console.error("Error creating CV:", error);
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
                {cvModel.languages?.map((lang, index) => (
                  <li key={index}>
                    <span className={styles.text}>{lang.name}</span>
                    <Slider
                      value={lang.proficiency}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        updateUserResponse(newValue, "LANGUAGES", (index * 2) + 2);
                      }}
                    />
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
                {cvModel.professionalSkills?.map((skill, index) => (
                  <div className={styles.box} key={index}>
                    <h4>{skill.skillName}</h4>
                    <Slider
                      value={skill.proficiency}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        updateUserResponse(newValue, "COMPETENCES PROFESSIONNELLES", (index * 2) + 2);
                      }}
                    />
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

            <button onClick={saveCVToServer} className={styles.btn}>
              Save to Server
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVModel7;
