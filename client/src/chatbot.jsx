// Chat.jsx

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import styles from "./chatbot.module.css"; // Assurez-vous d'avoir un fichier CSS avec les styles appropriés
import axios from "axios";

const Chat = ({ updateCvContent, updateTitleContent }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [conversationState, setConversationState] = useState(null);

  useEffect(() => {
    // Envoyer le message "Bonjour" lorsque le composant est monté
    sendHelloMessage();
  }, []); // Assurez-vous que cette fonction ne s'exécute qu'une seule fois lors du montage du composant

  const sendHelloMessage = async () => {
    const response = await axios.post(
      "http://localhost:5000/new-question",
      {
        cv_title: "Titre du CV",
        cv_content: "",
        conversation_state: conversationState,
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const botResponse = response.data.response;
    const nextQuestionKey = response.data.next_question_key;

    setMessages([...messages, { text: botResponse, user: "bot" }]);
    setConversationState(nextQuestionKey === "start" ? null : { state: nextQuestionKey });
  };

  const sendMessage = async () => {
    const response = await axios.post(
      "http://localhost:5000/new-question",
      {
        cv_title: "Titre du CV",
        cv_content: input,
        conversation_state: conversationState,
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const botResponse = response.data.response;
    const nextQuestionKey = response.data.next_question_key;

    setMessages([...messages, { text: input, user: "me" }, { text: botResponse, user: "bot" }]);
    setInput("");

    if (nextQuestionKey) {
      setConversationState({ state: nextQuestionKey });
    } else {
      setConversationState(null); // Supprimer la variable de l'état de la conversation
    }

    // Mettre à jour le titre si une réponse a été donnée à une question spécifique
    updateTitleContent(botResponse, input);
  };

  const handleSendMessage = async () => {
    await sendMessage();

    // Mettre à jour le contenu du CV avec le nouveau message
    updateCvContent(input);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.leftPanel}>
        <div className={styles.container}>
          <div className={styles.messageContainer}>
            {messages.map((message, index) => (
              <div key={index} className={`${styles.message} ${message.user === "me" ? styles.me : styles.bot}`}>
                {message.user}: {message.text}
              </div>
            ))}
          </div>
          <input className={styles.inputField} value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={handleKeyPress} />
          <button className={styles.sendButton} onClick={handleSendMessage}>
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </div>
      </div>
    </div>
  );
};

Chat.propTypes = {
  updateCvContent: PropTypes.func.isRequired,
  updateTitleContent: PropTypes.func.isRequired,
};

export default Chat;
