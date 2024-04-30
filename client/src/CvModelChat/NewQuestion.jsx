import React from "react";
import PropTypes from "prop-types";
import styles from "./NewQuestion.module.css";

const NewQuestion = ({ setConversationState }) => {
  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = (event) => {
    event.preventDefault();
    // Mettre à jour l'état de la conversation avec la nouvelle question
    setConversationState({ state: "nouvelle_question" }); // Remplacez "nouvelle_question" par la clé de la prochaine question
  };

  return (
    <div className={styles.questionContainer}>
      <form onSubmit={handleSubmit}>
        <label htmlFor="userInput" className={styles.label}>
          Nouvelle Question:
        </label>
        <input
          type="text"
          id="userInput"
          name="userInput"
          className={styles.input}
          placeholder="Entrez votre nouvelle question ici"
        />
        <button type="submit" className={styles.button}>
          Envoyer
        </button>
      </form>
    </div>
  );
};

// Validation des props avec PropTypes
NewQuestion.propTypes = {
  conversationState: PropTypes.object,
  setConversationState: PropTypes.func.isRequired,
};

export default NewQuestion;
