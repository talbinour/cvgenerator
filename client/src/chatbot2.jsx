import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import styles from './chatbot2.module.css'; // Import CSS module
import axios from 'axios';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const sendMessage = async (message) => {
        const response = await fetch("http://localhost:5000/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message })
        });
        const data = await response.json();
        return data.response;
    };
    
    const saveMessageToBackend = async (message) => {
        try {
            const saveResponse = await axios.post("http://localhost:5000/save-message", { message }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log(saveResponse.data.message); // Affichez un message de confirmation
        } catch (error) {
            console.error("Erreur lors de l'enregistrement du message:", error);
        }
    };
    
    const handleSendMessage = async () => {
        const response = await sendMessage(input);
        setMessages([...messages, { text: input, user: "me", timestamp: new Date() }, { text: response, user: "bot", timestamp: new Date() }]);
        setInput("");
        saveMessageToBackend(input); // Enregistrer le message de l'utilisateur vers le backend
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
                            <div key={index} className={`${styles.message} ${message.user === 'me' ? styles.me : styles.bot}`}>
                                {message.user}: {message.text}
                            </div>
                        ))}
                    </div>
                    <input className={styles.inputField} value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={handleKeyPress} />
                    <button className={styles.sendButton} onClick={handleSendMessage} >
                        <FontAwesomeIcon icon={faPaperPlane} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat;
