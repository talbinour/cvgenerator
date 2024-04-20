import React, { useState, useEffect, useRef } from "react";
import styles from './Home.module.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [cvList, setCVList] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const cvListRef = useRef(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get('http://localhost:8080/current-username', { withCredentials: true });
          setCurrentUser(response.data.user.nom);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du nom d\'utilisateur :', error);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchCVs = async () => {
      try {
        const response = await axios.get('http://localhost:8080/getCVs');
        // Dupliquez la liste pour créer un effet de boucle circulaire
        setCVList([...response.data, ...response.data]);
      } catch (error) {
        console.error("Failed to fetch CVs:", error);
      }
    };

    fetchCVs();
  }, []);

  useEffect(() => {
    const scrollInterval = setInterval(() => {
      if (cvListRef.current) {
        cvListRef.current.scrollLeft += 1; // Réglez la vitesse de défilement en ajustant la valeur
        if (cvListRef.current.scrollLeft >= cvListRef.current.scrollWidth / 2) {
          // Faites pivoter la liste de 180 degrés pour un défilement circulaire
          cvListRef.current.scrollLeft -= cvListRef.current.scrollWidth / 2;
        }
      }
    }, 50); // Réglez la fréquence de défilement en ajustant la valeur

    return () => clearInterval(scrollInterval);
  }, []);

  const handleCVClick = (cvcontent) => {
    navigate(`/${cvcontent}`);
  };

  const handleWriteCVClick = () => {
    if (currentUser) {
      navigate("/chatbot");
    } else {
      alert("Vous devez vous connecter pour accéder à cette fonctionnalité.");
      setTimeout(() => {
        navigate("/login");
      }, 100);
    }
  };

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1 style={{ color: '#132043' }}>Créez votre CV professionnel</h1>
        <p>Remplissez le formulaire, choisissez un modèle et téléchargez votre CV en quelques minutes.</p>
        <button className={styles.createButton} style={{ backgroundColor: '#F1B4BB', color: '#FDF0F0' }} onClick={handleWriteCVClick}>Créer un CV</button>
      </section>
      <section className={styles.models}>
        <h1 style={{ color: '#132043' }}>Modèles de CV</h1>
        <div className={styles.cvListHorizontal} ref={cvListRef}>
          {cvList.map((cv, index) => (
            <div key={index} className={styles.cvItem} onClick={() => handleCVClick(cv.content)}>
              <img src={cv.imageURL} alt={cv.title} className={styles.cvImage} />
              <p className={styles.cvTitle}>{cv.title}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className={styles.footer}>
        <p>Vous avez des questions sur notre site Web ? Consultez notre FAQ</p>
        <button className={styles.downloadButton}>Faire un CV en ligne</button>
      </footer>
    </div>
  );
};

export default Home;
