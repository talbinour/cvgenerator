import React, { useState } from "react";
import styles from './Testimonials.module.css';

const PressedReviews = () => {
    const [selectedStars, setSelectedStars] = useState(0);
    const [message, setMessage] = useState('');
  
    const handleStarClick = (stars) => {
      setSelectedStars(stars);
    };
  
    const handleInputChange = (e) => {
      setMessage(e.target.value);
    };
  
    const handleSubmit = () => {
      // Envoyer le nombre d'étoiles sélectionné et le message au serveur ou à une autre fonction de gestion
      console.log('Étoiles sélectionnées :', selectedStars);
      console.log('Message :', message);
    };
  
    return (
      <section className={styles.pressedReviews}>
        <h1 className={styles.h1Title}>Donnez votre avis sur notre site</h1>
        <div className={styles.reviewForm}>
          <div className={styles.starSelection}>
            <p className={styles.starLabel}>Évaluez notre site :</p>
            <div className={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={star <= selectedStars ? styles.starSelected : styles.star}
                  onClick={() => handleStarClick(star)}
                >
                  &#9733;
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
    );
  };

export default PressedReviews;
