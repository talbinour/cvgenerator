import React, { useState, useEffect } from "react";
import Chat from "../chatbot";
import axios from "axios";
import styles from "./CVModel7.module.css";
import avatar from "../assets/cvprofile.jpeg";

const CVModel7 = () => {
  const [userId, setUserId] = useState(null);
  //const [cvTitle, setCvTitle] = useState(""); // Titre initial
  const [cvModel, setCvModel] = useState({
    name: "",
    prenom: "",
    job: "",
    phone: "",
    email: "",
    website: "",
    linkedin: "",
    address: "",
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
          });
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des informations utilisateur:", error);
        });
    }
  }, [userId]);

  const updateTitleContent = (question, answer) => {
    switch (question) {
      case "Quel est votre numéro de téléphone ?":
        setCvModel((prevState) => ({ ...prevState, phone: answer }));
        break;
      case "Quelle est votre adresse e-mail ?":
        setCvModel((prevState) => ({ ...prevState, email: answer }));
        break;
      case "Quel est l'URL de votre site web ?":
        setCvModel((prevState) => ({ ...prevState, website: answer }));
        break;
      case "Quel est votre profil LinkedIn ?":
        setCvModel((prevState) => ({ ...prevState, linkedin: answer }));
        break;
      case "Dans quel pays êtes-vous basé(e) ?":
        setCvModel((prevState) => ({ ...prevState, address: answer }));
        break;
      default:
        break;
    }
  };

  const updateUserResponse = (response) => {
    // Mettre à jour les informations de contact
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

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.leftPanel}>
      <Chat updateTitleContent={updateTitleContent} updateUserResponse={updateUserResponse} setCvModel={setCvModel} />      </div>
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
              <ul></ul>
            </div>
            <div className={styles.languages}>
              <h3 className={styles.title}>LANGUAGES</h3>
              <ul></ul>
            </div>
          </div>
          <div className={styles.right_Side}>
            <div className={styles.about}>
              <h2 className={styles.title2}>PROFILE</h2>
              <p></p>
            </div>
            <div className={styles.about}>
              <h2 className={styles.title2}>Expérience</h2>
              <div className={styles.box}>
                <div className={styles.year_company}>
                  <h5></h5>
                  <h5></h5>
                </div>
                <div className={styles.text}>
                  <h4></h4>
                  <p></p>
                </div>
              </div>
            </div>
            <div className={`${styles.about} ${styles.skills}`}>
              <h2 className={styles.title2}>Compétences Professionnelles</h2>
              <div className={styles.skillContainer}></div>
            </div>
            <div className={styles.AboutInterest}>
              <h2 className={styles.title2}>Intérêts</h2>
              <ul>
                <li>
                  <i className="fa fa-circle"></i>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVModel7;