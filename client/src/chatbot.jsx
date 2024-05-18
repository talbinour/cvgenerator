import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import styles from "./chatbot.module.css";
import axios from "axios";

const Chat = ({ updateUserResponse }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [conversationState, setConversationState] = useState(null);
  const [sectionKey, setSectionKey] = useState(""); // eslint-disable-line no-unused-vars
  const [questionNumber, setQuestionNumber] = useState(0); // eslint-disable-line no-unused-vars
  const [conversationBlocked, setConversationBlocked] = useState(false);
  const [isSending, setIsSending] = useState(false); // Nouvel état pour gérer l'envoi en cours

  const sendMessage = async () => {
    if (!input.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "S'il vous plaît répondez à la question précédente.", user: "bot" }
      ]);
      return;
    }

    setIsSending(true); // Désactiver le bouton d'envoi pendant l'envoi

    try {
      const response = await axios.post("http://localhost:5000/new-question", {
        message: input,
        conversation_state: conversationState,
      });

      const botResponse = response.data.response;

      setMessages((prevMessages) => [
        ...prevMessages,
        { text: input, user: "me" },
        { text: botResponse, user: "bot" }
      ]);
      setInput("");
      setConversationState(response.data.conversation_state);

      if (response.data.conversation_state) {
        setSectionKey(response.data.section_key);
        setQuestionNumber(response.data.question_number);
        updateUserResponse(input, response.data.section_key, response.data.question_number);
        setConversationBlocked(false);
      } else {
        setConversationBlocked(true);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "Merci pour les informations. Votre CV est complet.", user: "bot" }
        ]);
      }
    } catch (error) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Erreur lors de l'envoi du message. Veuillez réessayer.", user: "bot" }
      ]);
    } finally {
      setIsSending(false); // Réactiver le bouton d'envoi après l'envoi
    }
  };

  useEffect(() => {
    const sendInitialMessage = async () => {
      try {
        const response = await axios.post("http://localhost:5000/new-question", {
          conversation_state: null,
        });

        const botResponse = response.data.response;
        setMessages([{ text: botResponse, user: "bot" }]);
        setConversationState(response.data.conversation_state);
        setSectionKey(response.data.section_key);
        setQuestionNumber(response.data.question_number);
      } catch (error) {
        setMessages([{ text: "Erreur lors de l'initialisation de la conversation. Veuillez réessayer plus tard.", user: "bot" }]);
      }
    };

    if (messages.length === 0) {
      sendInitialMessage();
    }
  }, []); // Passer un tableau vide pour s'assurer que cette fonction ne s'exécute qu'une fois lors du montage

  const handleSendMessage = async () => {
    await sendMessage();
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !isSending && !conversationBlocked) {
      sendMessage();
    }
  };

  const handleInputChange = (event) => {
    if (conversationBlocked) {
      event.preventDefault();
    } else {
      setInput(event.target.value);
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
        </div>
        <div className={styles.inputContainerBottom}>
          <input
            className={styles.inputField}
            value={input}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            disabled={conversationBlocked || isSending}
          />
          <button
            className={styles.sendButton}
            onClick={handleSendMessage}
            disabled={conversationBlocked || isSending}
          >
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </div>
      </div>
    </div>
  );
};

Chat.propTypes = {
  updateUserResponse: PropTypes.func.isRequired,
};

export default Chat;
