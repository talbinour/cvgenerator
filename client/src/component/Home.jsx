import React, { useState, useEffect, useRef } from "react";
import styles from './Home.module.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [cvList, setCVList] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const cvListRef = useRef(null);
  const [showDescription, setShowDescription] = useState(false); // Initialiser showDescription à false
  const [typedText, setTypedText] = useState(''); // Initialiser le texte tapé à une chaîne vide
  const description = "  Votre parcours professionnel intelligemment raconté. Commencez ici pour créer un CV qui se démarque. Sélectionnez un modèle, remplissez vos informations, et notre plateforme générera un CV professionnel en quelques minutes.";

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
        cvListRef.current.scrollLeft += 1;
        if (cvListRef.current.scrollLeft >= cvListRef.current.scrollWidth / 2) {
          cvListRef.current.scrollLeft -= cvListRef.current.scrollWidth / 2;
        }
      }
    }, 50);

    return () => clearInterval(scrollInterval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowDescription(true); // Activer l'affichage du paragraphe après un certain délai
    }, 400); // Définir le délai en millisecondes

    return () => clearTimeout(timer); // Nettoyer le timer lors du démontage du composant
  }, []);

  useEffect(() => {
    if (showDescription) {
      let index = 0;
      const interval = setInterval(() => {
        setTypedText((prevText) => prevText + description[index]);
        index++;
        if (index === description.length) {
          clearInterval(interval);
        }
      }, 50);
      return () => clearInterval(interval);
    }
  }, [showDescription, description]);

  const handleCVClick = (cvcontent) => {
    navigate(`/${cvcontent}`);
  };

  const handleWriteCVClick = () => {
    if (currentUser) {
      navigate("/cvselection");
    } else {
      alert("Connectez-vous pour personnaliser et sauvegarder votre CV.");
      setTimeout(() => {
        navigate("/login");
      }, 100);
    }
  };

  return (
    <div className={styles.container}>
        <section className={styles.hero}>
            <h1>Bienvenue sur Cevor</h1>
            <div className={styles.descriptionContainer}>
                <p className={`${styles.description} ${showDescription ? styles.show : ''}`}>
                    {typedText}
                </p>
            </div>
            <button className={styles.createButton} onClick={handleWriteCVClick}>Commencer votre CV</button>
        </section>
        <section className={styles.models}>
            <h1>Explorez nos modèles</h1>
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
            <p>Des questions ? Consultez notre FAQ ou contactez-nous directement.</p>
            <button className={styles.downloadButton}>Créez votre CV maintenant</button>
        </footer>
    </div>
);

};

export default Home;
