import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import styles from './chatbot.module.css'; // Import CSS module
import User from './Cv/model7-user'; // Importez le composant Edit
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
    
    const saveUserResponseToBackend = async (response) => {
        try {
            const saveResponse = await axios.post("http://localhost:5000/profile", { response }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log(saveResponse.data.message); // Affichez un message de confirmation
        } catch (error) {
            console.error("Erreur lors de l'enregistrement de la réponse utilisateur:", error);
        }
    };
    
    const saveResponseToBackend = async (userInput, botResponse) => {
        try {
            const response = await axios.post("http://localhost:5000/save-response", { userInput, botResponse }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log(response.data.message); // Afficher un message de confirmation
        } catch (error) {
            console.error("Erreur lors de l'enregistrement de la réponse :", error);
        }
    };
    
    const handleSendMessage = async () => {
        const response = await sendMessage(input);
        setMessages([...messages, { text: input, user: "me" }, { text: response, user: "bot" }]);
        setInput("");
        saveUserResponseToBackend(input); // Enregistrer la réponse de l'utilisateur vers le backend
        saveResponseToBackend(input, response); // Enregistrer la réponse vers le backend
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
                    <input className={styles.inputField} value={input} onChange={(e) => setInput(e.target.value)} />
                    <button className={styles.sendButton} onClick={handleSendMessage}>
                        <FontAwesomeIcon icon={faPaperPlane} />
                    </button>
                </div>
            </div>
            <div className={styles.rightPanel}>
                {/* Affichez le composant Edit ici */}
                <User />
            </div>
        </div>
    );
};

export default Chat;
