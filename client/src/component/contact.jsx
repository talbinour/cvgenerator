import React from 'react';
import styles from './Contact.module.css';
const contact = () => {
  return (
    <section className={styles.contact}>
      <h2 className={styles.sectionTitle}>Contactez-nous</h2>
      <p>Pour toute question ou préoccupation, n&lsquo;hésitez pas à nous contacter :</p>
      <form className={styles.contactForm}>
        <input type="text" placeholder="Nom" />
        <input type="email" placeholder="Adresse e-mail" />
        <textarea placeholder="Message"></textarea>
        <button type="submit" className={styles.submitButton}>Envoyer</button>
      </form>
    </section>
  );
};

export default contact;
