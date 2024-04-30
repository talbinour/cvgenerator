import React, { useState, useEffect } from "react";
import PropTypes from "prop-types"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import styles from "./chatbot.module.css";
import axios from "axios";

const Chat = ({ updateUserResponse, setCvModel }) => {
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
  
    // Mettre à jour les messages et le modèle de CV
    setMessages([...messages, { text: input, user: "me" }, { text: botResponse, user: "bot" }]);
    setInput("");
  
    // Mettre à jour le modèle de CV en appelant updateUserResponse
    updateUserResponse && updateUserResponse(botResponse, input);
  
    if (input.includes(",")) {
      const [phone, email, website, linkedin, address] = input.split(",");
      setCvModel((prevState) => ({
        ...prevState,
        phone: phone.trim(),
        email: email.trim(),
        website: website.trim(),
        linkedin: linkedin.trim(),
        address: address.trim(),
      }));
    }
  
    if (nextQuestionKey) {
      setConversationState({ state: nextQuestionKey });
    } else {
      setConversationState(null);
    }
  };
  
  const handleSendMessage = async () => {
    await sendMessage();
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  const handleAddMoreInfo = async () => {
    const response = await axios.post(
      "http://localhost:5000/add-more-info",
      {
        message: input,
        conversation_state: conversationState,
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const botResponse = response.data.response;
    const nextQuestionKey = response.data.next_question_key;

    setMessages([...messages, { text: input, user: "me" }, { text: botResponse, user: "bot" }]);
    setInput("");
    setConversationState({ state: nextQuestionKey });
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
          <button className={styles.addButton} onClick={handleAddMoreInfo}>
            Add More Info
          </button>
        </div>
      </div>
    </div>
  );
};

// Validez les props avec PropTypes
Chat.propTypes = {
  updateUserResponse: PropTypes.func,
  setCvModel: PropTypes.func.isRequired,
};

export default Chat;
