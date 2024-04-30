import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import styles from "./chatbot.module.css";
import axios from "axios";

const Chat = ({ updateTitleContent, updateUserResponse }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [conversationState, setConversationState] = useState(null);

  useEffect(() => {
    sendHelloMessage();
  }, []);

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

    if (updateUserResponse) {
      updateUserResponse(input, nextQuestionKey); // Update CV model with user response
    }

    if (nextQuestionKey) {
      setConversationState({ state: nextQuestionKey });
    } else {
      setConversationState(null);
    }

    if (updateTitleContent) {
      updateTitleContent(botResponse, input); // Call updateTitleContent function if defined
    }

    // Call handleResponse to handle the response
    handleResponse(botResponse, input);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  const handleResponse = (question, response) => {
    switch (question) {
      case "Quel est votre numéro de téléphone ?":
        updateTitleContent("CONTACT_INFO", response);
        break;
      case "Quelle est votre adresse e-mail ?":
        updateTitleContent("CONTACT_INFO", response);
        break;
      case "Quel est l'URL de votre site web ?":
        updateTitleContent("CONTACT_INFO", response);
        break;
      case "Quel est votre profil LinkedIn ?":
        updateTitleContent("CONTACT_INFO", response);
        break;
      case "Dans quel pays êtes-vous basé(e) ?":
        updateTitleContent("CONTACT_INFO", response);
        break;
      case "Où avez-vous étudié ?":
        updateTitleContent("FORMATION", response);
        break;
      case "Quel est le nom de votre école/université ?":
        updateTitleContent("FORMATION", response);
        break;
      case "Pouvez-vous préciser la période de temps de vos études ?":
        updateTitleContent("FORMATION", response);
        break;
      case "Quelles langues parlez-vous et à quel niveau ?":
        updateTitleContent("LANGUAGES", response);
        break;
      case "Pouvez-vous nous parler un peu de vous ?":
        updateTitleContent("PROFILE", response);
        break;
      case "Quel est votre poste ?":
        updateTitleContent("EXPÉRIENCE", response);
        break;
      case "Quel est le nom de votre employeur ?":
        updateTitleContent("EXPÉRIENCE", response);
        break;
      case "Dans quelle ville avez-vous travaillé ?":
        updateTitleContent("EXPÉRIENCE", response);
        break;
      case "Quelle est la date de début de votre expérience professionnelle ?":
        updateTitleContent("EXPÉRIENCE", response);
        break;
      case "Quelle est la date de fin de votre expérience professionnelle ?":
        updateTitleContent("EXPÉRIENCE", response);
        break;
      case "Pouvez-vous décrire votre expérience professionnelle ?":
        updateTitleContent("EXPÉRIENCE", response);
        break;
      case "Quelles compétences avez-vous et à quel niveau ?":
        updateTitleContent("COMPÉTENCES_PROFESSIONNELLES", response);
        break;
      case "Quels sont vos centres d'intérêt ?":
        updateTitleContent("INTÉRÊTS", response);
        break;
      case "Quel est votre titre de formation ?":
        updateTitleContent("FORMATIONS", response);
        break;
      case "Quel est le nom de votre établissement ?":
        updateTitleContent("FORMATIONS", response);
        break;
      case "Dans quelle ville avez-vous étudié ?":
        updateTitleContent("FORMATIONS", response);
        break;
      case "Quelle est la date de début de votre formation ?":
        updateTitleContent("FORMATIONS", response);
        break;
      case "Quelle est la date de fin de votre formation ?":
        updateTitleContent("FORMATIONS", response);
        break;
      case "Pouvez-vous décrire votre formation ?":
        updateTitleContent("FORMATIONS", response);
        break;
      default:
        break;
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chat}>
        {messages.map((message, index) => (
          <div key={index} className={styles.messageContainer}>
            <div className={`${styles.message} ${message.user === "me" ? styles.me : styles.bot}`}>
              {message.text}
            </div>
          </div>
        ))}
      </div>
      <div className={styles.inputContainer}>
        <input
          className={styles.input}
          type="text"
          placeholder="Entrez votre message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button className={styles.sendButton} onClick={sendMessage}>
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </div>
    </div>
  );
};

Chat.propTypes = {
  updateTitleContent: PropTypes.func,
  updateUserResponse: PropTypes.func,
};

export default Chat;
