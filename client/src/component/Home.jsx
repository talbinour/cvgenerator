import React, { useState, useEffect, useRef } from "react";
import styles from './Home.module.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Chat from "../chatbot/chatbot2"; 
import boot from '../assets/robotics.png';
import TestContainer from './TestContainer';
import { FaRegStar,FaStar } from "react-icons/fa";

//import image_url from '../assets/img.png';
const Home = () => {
  const [userId, setUserId] = useState('');
  const [nom, setNom] = useState('');
  const [userPhoto, setUserPhoto] = useState(null); 

  const [cvList, setCVList] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const cvListRef = useRef(null);
  const [showDescription, setShowDescription] = useState(false); 
  const [typedText, setTypedText] = useState(''); 
  const description = "  Votre parcours professionnel intelligemment raconté. Commencez ici pour créer un CV qui se démarque. Sélectionnez un modèle, remplissez vos informations, et notre plateforme générera un CV professionnel en quelques minutes.";
  const [showChat, setShowChat] = useState(false);
  const [showChatMessage, setShowChatMessage] = useState(false);
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [tests, setTests] = useState([]);
  const [selectedStars, setSelectedStars] = useState(0);
    const [message, setMessage] = useState('');
    const [backgroundImage, setBackgroundImage] = useState('');
    const [reviews, setReviews] = useState([]);
  
    const handleStarClick = (stars) => {
      setSelectedStars(stars);
    };
  
    const handleInputChange = (e) => {
      setMessage(e.target.value);
    };
  
   
    const handleSubmit = async () => {
      try {
        if (!currentUser) {
          // Gérer le cas où currentUser n'est pas défini
          console.error('Utilisateur non défini');
          return;
        }
        const iduser =userId;
        const name = nom;
        const photo = userPhoto;
        // Envoyer les données au serveur
        const response = await axios.post('http://localhost:8080/api/reviews', {
          iduser,
          stars: selectedStars,
          message,
          name,
          photo
        });
        console.log(response.data);
      } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'avis :', error);
      }
    };
    

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get('http://localhost:8080/current-username', { withCredentials: true });
          setCurrentUser(response.data.user.nom);
          const userData = response.data.user;
          const userId = userData.id || userData.user_id;
          setUserId(userId);
          setNom(userData.nom);
          setUserPhoto(userData.photo);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du nom d\'utilisateur :', error);
      }
    };

    fetchCurrentUser();
  }, []);
  
  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/tests-langue');
        setTests(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };

    fetchTests();
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
    const fetchReviews = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/reviews');
        setReviews(response.data);
        console.log("reviews:",setReviews) // Mettre à jour l'état des avis avec les données récupérées
      } catch (error) {
        console.error('Erreur lors de la récupération des avis :', error);
      }
    };
  
    fetchReviews();
  }, []);
  

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowDescription(true); 
    }, 400); 
    setTimeout(() => {
      setBackgroundImage(boot);
    }, 2000);


    return () => clearTimeout(timer); 
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

  useEffect(() => {
    const testInterval = setInterval(() => {
      setCurrentTestIndex((prevIndex) => (prevIndex + 3) % tests.length);
    }, 3000);
    return () => clearInterval(testInterval);
  }, [tests]);

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

  const toggleChat = () => {
    setShowChat(!showChat);
    setShowChatMessage(false);
  };

  const handleChatIconMouseEnter = () => {
    setShowChatMessage(true);
  };

  const handleChatIconMouseLeave = () => {
    setShowChatMessage(false);
  };

  const chatContainer = useRef(null);

  const scrollToBottom = () => {
    chatContainer.current.scrollTop = chatContainer.current.scrollHeight;
  };
  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  return (
    <div className={styles.container}>
      {showChat && (
        <div className={styles.chatContainer} ref={chatContainer}>
          <Chat scrollToBottom={scrollToBottom} />
        </div>
      )}
      <div className={styles.chatIconContainer}>
        <img 
          src={boot} 
          alt="Chatbot"
          className={styles.chatIcon}
          onClick={toggleChat}
          onMouseEnter={handleChatIconMouseEnter}
          onMouseLeave={handleChatIconMouseLeave}
        />
        {showChatMessage && (
          <div className={styles.chatIconMessage}>
            Besoin d&apos;aide ?
          </div>
        )}
      </div>
      
      <section className={`${styles.hero} ${showDescription ? styles.heroAnimated : ''}`} style={{ backgroundImage: showDescription ? `url(${backgroundImage})` : 'none' }}>
        <h1 className="h1Title">Bienvenue sur Cevor</h1>
        <div className={styles.descriptionContainer}>
          <p className={`${styles.description} ${showDescription ? styles.show : ''}`}>
            {typedText}
          </p>
        </div>
        <button className={styles.createButton} onClick={handleWriteCVClick}>Commencer votre CV</button>
      </section>

            <section className={styles.models}>
            <h1 className="h1Title">Explorez nos modèles</h1>
              <div className={styles.cvListHorizontal} ref={cvListRef}>
                {cvList.map((cv, index) => (
                  <div key={index} className={styles.cvItem} onClick={() => handleCVClick(cv.content)}>
                    <img src={cv.imageURL} alt={cv.title} className={styles.cvImage} />
                    <p className={styles.cvTitle}>{cv.title}</p>
                  </div>
                ))}
              </div>
      </section>
      <section className={styles.languageTests}>
      <h1 className="h1Title">Tests de Langue</h1>
        {tests.length > 0 && (
          <TestContainer tests={tests.slice(currentTestIndex, currentTestIndex + 3)} />
        )}
      </section>
      <section className={styles.howItWorks}>
        <h2>Comment ça marche ?</h2>
        <div className={styles.steps}>
          {/* Étapes */}
          <div className={styles.step}>
            <h3>Étape 1</h3>
            <p>Inscrivez-vous sur notre site.</p>
          </div>
          <div className={styles.step}>
            <h3>Étape 2</h3>
            <p>Sélectionnez un modèle de CV ou créez le vôtre.</p>
          </div>
          <div className={styles.step}>
            <h3>Étape 3</h3>
            <p>Remplissez vos informations et personnalisez votre CV.</p>
          </div>
          <div className={styles.step}>
            <h3>Étape 4</h3>
            <p>Téléchargez ou partagez votre CV.</p>
          </div>
        </div>
        {/* Vidéo */}
        <div className={styles.videoContainer}>
    <iframe
      width="560"
      height="315"
      src="https://www.youtube.com/embed/dQw4w9WgXcQ"
      title="YouTube video player"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>
  </div>
      </section>
      
      <section className={styles.pressedReviews}>
        <h1 className={styles.h1Title}>Donnez votre avis sur notre site</h1>
        <div className={styles.reviewForm}>
          <div className={styles.starSelection}>
            <p className={styles.starLabel}>Évaluez notre site :</p>
            <div className={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} onClick={() => handleStarClick(star)}>
                  {selectedStars >= star ? <FaStar /> : <FaRegStar />}
                </span>
              ))}
            </div>
          </div>
         
          <textarea
            className={styles.messageInput}
            placeholder="Écrivez votre avis ici..."
            value={message}
            onChange={handleInputChange}
          />
          <button className={styles.submitButton} onClick={handleSubmit}>Envoyer</button>
        </div>
      </section>
      <section className={styles.userReviews}>
        <h1 className={styles.h1Title}>Avis des utilisateurs</h1>
        <div className={styles.reviewList}>
          {reviews.map((review, index) => (
            <div key={index} className={styles.reviewItem}>
              <div className={styles.userInfo}>
                <img src={review.photo}  className={styles.userPhoto} />
                
                <p className={styles.userName}>{review.name}</p>
              </div>
              <div className={styles.reviewStars}>
                {[...Array(5)].map((_, i) => (
                  <span key={i}>
                    {i < review.stars ? <FaStar className={styles.starIconFilled} /> : <FaRegStar className={styles.starIcon} />}
                  </span>
                ))}
              </div>
              <p className={styles.reviewMessage}>{review.message}</p>
              <p className={styles.reviewdate}>{formatDate(review.date)}</p>
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