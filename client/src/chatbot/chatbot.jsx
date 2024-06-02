import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import axios from "axios";

const Wrapper = styled.div`
  display: flex;
  height: 600px;
  flex-direction: column;
`;

const MessageContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
`;

const Message = styled.div`
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: ${({ user }) => (user === "me" ? "#007bff" : "#f8f9fa")};
  color: ${({ user }) => (user === "me" ? "#fff" : "#212529")};
`;

const InputContainer = styled.div`
  background-color: #f8f9fa;
  padding: 0.5rem;
  display: flex;
  align-items: center;
`;

const InputField = styled.input`
  flex: 1;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem;
  margin-right: 0.5rem;
`;

const SendButton = styled.button`
  border: none;
  background-color: #007bff;
  color: #fff;
  padding: 0.5rem;
  border-radius: 0.5rem;
  cursor: pointer;

  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
`;

const Chat = ({ updateUserResponse }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [conversationState, setConversationState] = useState(null);
  const [sectionKey, setSectionKey] = useState("");
  const [questionNumber, setQuestionNumber] = useState(0);
  const [conversationBlocked, setConversationBlocked] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "S'il vous plaît répondez à la question précédente.", user: "bot" },
      ]);
      return;
    }

    updateUserResponse(input, sectionKey, questionNumber);

    try {
      const response = await axios.post("http://localhost:5000/new-question", {
        message: input,
        conversation_state: conversationState,
      });

      const botResponse = response.data.response;

      setMessages((prevMessages) => [
        ...prevMessages,
        { text: input, user: "me" },
        { text: botResponse, user: "bot" },
      ]);
      setInput("");
      setConversationState(response.data.conversation_state);

      if (response.data.conversation_state) {
        setSectionKey(response.data.section_key);
        setQuestionNumber(response.data.question_number);
        setConversationBlocked(false);
      } else {
        setConversationBlocked(true);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "Merci pour les informations. Votre CV est complet.", user: "bot" },
        ]);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
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
        console.error("Erreur lors de l'envoi du message initial:", error);
      }
    };

    sendInitialMessage();
  }, []);

  const handleSendMessage = async () => {
    if (!conversationBlocked) {
      await sendMessage();
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !conversationBlocked) {
      sendMessage();
    }
  };

  const handleInputChange = (event) => {
    if (!conversationBlocked) {
      setInput(event.target.value);
    }
  };

  return (
    <Wrapper>
      <MessageContainer>
        {messages.map((message, index) => (
          <Message key={index} user={message.user}>
            {message.user}: {message.text}
          </Message>
        ))}
      </MessageContainer>
      <InputContainer>
        <InputField
          value={input}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          disabled={conversationBlocked}
          placeholder="Écrivez votre message..."
        />
        <SendButton onClick={handleSendMessage} disabled={conversationBlocked}>
          <FontAwesomeIcon icon={faPaperPlane} />
        </SendButton>
      </InputContainer>
    </Wrapper>
  );
};

Chat.propTypes = {
  updateUserResponse: PropTypes.func.isRequired,
};

export default Chat;
