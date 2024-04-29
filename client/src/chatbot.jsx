import React, { useState, useEffect } from "react";
import PropTypes from "prop-types"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import styles from "./chatbot.module.css";
import axios from "axios";

const Chat = ({ updateCvContent, updateTitleContent, setCvModel }) => {
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
  
    // Séparer la réponse de l'utilisateur en différentes parties
    const [phone, email, website, linkedin, address] = input.split(",");
  
    // Mettre à jour les messages et le modèle de CV
    setMessages([...messages, { text: input, user: "me" }, { text: botResponse, user: "bot" }]);
    setInput("");
  
    // Mettre à jour le modèle de CV avec les informations de contact
    setCvModel((prevState) => ({
      ...prevState,
      phone: phone.trim(),
      email: email.trim(),
      website: website.trim(),
      linkedin: linkedin.trim(),
      address: address.trim(),
    }));
  
    if (nextQuestionKey) {
      setConversationState({ state: nextQuestionKey });
    } else {
      setConversationState(null);
    }
  
    updateTitleContent && updateTitleContent(botResponse, input); // Vérifiez si updateTitleContent est défini avant de l'appeler
  };
  
  const handleSendMessage = async () => {
    await sendMessage();
    updateCvContent && updateCvContent(input); // Vérifiez si updateCvContent est défini avant de l'appeler
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

// Validez les props avec PropTypes
Chat.propTypes = {
  updateCvContent: PropTypes.func, // Rendez updateCvContent facultatif
  updateTitleContent: PropTypes.func, // Rendez updateTitleContent facultatif
  setCvModel: PropTypes.func.isRequired, // La fonction setCvModel est requise
};

export default Chat;