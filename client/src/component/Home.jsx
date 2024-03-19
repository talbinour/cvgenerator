import React, { useState, useEffect } from "react";
import styles from './Home.module.css';
import {useNavigate } from "react-router-dom";

const Home = () => {
  const [cvList, setCVList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCVs = async () => {
      try {
        const response = await fetch('http://localhost:8080/getCVs');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setCVList(data);
      } catch (error) {
        console.error("Failed to fetch CVs:", error);
      }
    };

    fetchCVs();
  }, []);
// Gestionnaire de clic pour naviguer vers la page de détail du CV
const handleCVClick = (cvcontent) => {
  navigate(`/${cvcontent}`); // Remplacez `/cv/${cvId}` par votre chemin de route de détail
};
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1 style={{ color: '#132043' }}>Créez votre CV professionnel</h1>
        <p>Remplissez le formulaire, choisissez un modèle et téléchargez votre CV en quelques minutes.</p>
        <button className={styles.createButton} style={{ backgroundColor: '#F1B4BB', color: '#FDF0F0' }}>Créer un CV</button>
      </section>
      <section className={styles.models}>
        <h1 style={{ color: '#132043' }}>Modèles de CV</h1>
        <div className={styles.cvListHorizontal}>
          {cvList.map((cv) => (
            <div key={cv._id} className={styles.cvItem} onClick={() => handleCVClick(cv.content)}> {/* Ajoutez l'écouteur d'événement onClick ici */}
              <img src={cv.imageURL} alt={cv.title} className={styles.cvImage} />
              <p className={styles.cvTitle}>{cv.title}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className={styles.footer}>
        <p >Vous avez des questions sur notre site Web ? Consultez notre FAQ</p>
        <button className={styles.downloadButton}>Faire un CV en ligne</button>
      </footer>
    </div>
  );
};

export default Home;
