import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faPlus } from "@fortawesome/free-solid-svg-icons";
import styles from "./chatbot.module.css";
import axios from "axios";

const Chat = ({ updateTitleContent, updateUserResponse }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [conversationState, setConversationState] = useState(null);
  const [previousResponse, setPreviousResponse] = useState("");
  const [conversationBlocked, setConversationBlocked] = useState(false);

// Gestion de l'envoi de la réponse précédente
const handleAddResponse = async () => {
  const response = await axios.post(
    "http://localhost:5000/previous-question",
    {
      cv_title: "Titre du CV",
      cv_content: "",
      conversation_state: conversationState,
    },
    { headers: { "Content-Type": "application/json" } }
  );

  const botResponse = response.data.response;
  const previousResponse = response.data.previous_response;

  setInput(previousResponse);
  setMessages([...messages, { text: `Question précédente: ${botResponse}`, user: "bot" }]);
  setConversationState(response.data.conversation_state);
};

// Envoi du message
const sendMessage = async () => {
  if (!input.trim()) {
    setMessages([...messages, { text: "S'il vous plaît répondez à la question précédente.", user: "bot" }]);
    return;
  }

  const response = await axios.post(
    "http://localhost:5000/new-question",
    {
      cv_title: "Titre du CV",
      cv_content: input,
      conversation_state: conversationState,
      previous_response: previousResponse,
    },
    { headers: { "Content-Type": "application/json" } }
  );

  const botResponse = response.data.response;
  const nextQuestionKey = response.data.next_question_key;

  setMessages([...messages, { text: input, user: "me" }, { text: botResponse, user: "bot" }]);
  setInput("");
  setPreviousResponse(input);

  if (updateUserResponse) {
    updateUserResponse(input, nextQuestionKey);
  }

  if (nextQuestionKey) {
    setConversationState({ state: nextQuestionKey });
  } else {
    setConversationState(null);
    setConversationBlocked(true);
    setMessages([...messages, { text: "Merci pour les informations. Votre CV est complet.", user: "bot" }]);
  }

  if (updateTitleContent) {
    updateTitleContent(botResponse, input);
  }

  // Vérification de la redirection
  if (nextQuestionKey === "question10") {
    const response = await axios.post(
      "http://localhost:5000/verify-add-response",
      { response: input }, // Envoyer la réponse de l'utilisateur au backend
      { headers: { "Content-Type": "application/json" } }
    );

    const verified = response.data.verified;
    if (verified) {
      // Rediriger vers la question 6
      setConversationState({ state: "question6" });
    } else {
      // Passer à la question suivante
      setConversationState({ state: "question10" });
    }
  }
};

  
  useEffect(() => {
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

      if (!conversationBlocked) {
        setMessages([...messages, { text: botResponse, user: "bot" }]);
      }

      setConversationState(nextQuestionKey === "start" ? null : { state: nextQuestionKey });
    };

    sendHelloMessage();
  }, []);

  const handleSendMessage = async () => {
    await sendMessage();
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
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
          <input className={styles.inputField} value={input} onChange={handleInputChange} onKeyPress={handleKeyPress} disabled={conversationBlocked} />
          <button className={styles.sendButton} onClick={handleSendMessage} disabled={conversationBlocked}>
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
          {conversationState && conversationState.state === "question3" && (
            <button className={styles.addButton} onClick={handleAddResponse} disabled={conversationBlocked}>
              <FontAwesomeIcon icon={faPlus} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

Chat.propTypes = {
  updateTitleContent: PropTypes.func,
  updateUserResponse: PropTypes.func,
};

export default Chat;

