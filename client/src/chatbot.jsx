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
  const [conversationBlocked, setConversationBlocked] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) {
      setMessages((prevMessages) => [...prevMessages, { text: "S'il vous plaît répondez à la question précédente.", user: "bot" }]);
      return;
    }

    const response = await axios.post("http://localhost:5000/new-question", {
      message: input,
      conversation_state: conversationState,
    });
    

    const botResponse = response.data.response;
    const nextQuestionKey = response.data.next_question_key;

    setMessages((prevMessages) => [...prevMessages, { text: input, user: "me" }, { text: botResponse, user: "bot" }]);
    setInput("");
    setConversationState(response.data.conversation_state);

    if (!response.data.conversation_state) {
      setConversationBlocked(true);
      setMessages((prevMessages) => [...prevMessages, { text: "Merci pour les informations. Votre CV est complet.", user: "bot" }]);
    } else {
      setConversationBlocked(false);
    }

    if (updateUserResponse) {
      updateUserResponse(input, nextQuestionKey);
    }

    if (updateTitleContent) {
      updateTitleContent(botResponse, input);
    }
  };

  useEffect(() => {
    const sendInitialMessage = async () => {
      const response = await axios.post("http://localhost:5000/new-question", {
        conversation_state: null,
      });

      const botResponse = response.data.response;
      setMessages([{ text: botResponse, user: "bot" }]);
      setConversationState(response.data.conversation_state);
    };

    // Utilisation de `messages.length` pour éviter de répéter la question initiale.
    if (messages.length === 0) {
      sendInitialMessage();
    }
  }, [messages]);

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
          <input
            className={styles.inputField}
            value={input}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            disabled={conversationBlocked}
          />
          <button className={styles.sendButton} onClick={handleSendMessage} disabled={conversationBlocked}>
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
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
