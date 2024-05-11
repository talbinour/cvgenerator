import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import styles from './chatbot2.module.css'; // Import CSS module
import axios from 'axios';
import logoImage from './assets/chatbot.png';
import defaultAvatar from './assets/user.png';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [userPhoto, setUserPhoto] = useState(null);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get('http://localhost:8080/current-username', { withCredentials: true })
                .then(response => {
                    setUserPhoto(response.data.user.photo);
                    setUserId(response.data.user.id || response.data.user.user_id);
                })
                .catch(error => {
                    console.error('Erreur lors de la récupération du nom d\'utilisateur :', error);
                });
        }
    }, []);

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
            console.log(saveResponse.data.message);
        } catch (error) {
            console.error("Erreur lors de l'enregistrement du message:", error);
        }
    };

    const saveMessageToList = (message) => {
        setMessages(prevMessages => [...prevMessages, message]);
    };

    const handleSendMessage = async () => {
        const timestamp = new Date();
        const response = await sendMessage(input);
        const userMessage = { text: input, user: "me", timestamp, user_id: userId };
        const botMessage = { text: response, user: "Cevor", timestamp, user_id: userId };

        saveMessageToList(userMessage);
        saveMessageToList(botMessage);

        saveMessageToBackend({ message: input, response, user_id: userId });

        setInput("");
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            handleSendMessage();
        }
    };

    const handleDisconnect = () => {
        messages.forEach(message => saveMessageToBackend(message));
        setMessages([]);
    };

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.leftPanel}>
                <div className={styles.container}>
                    <div className={styles.messageContainer}>
                        {messages.map((message, index) => (
                            <div key={index} className={`${styles.message} ${message.user === 'me' ? styles.me : styles.bot}`}>
                                {message.user === 'me' ? (
                                    <>
                                        <div className={styles.messageText}>{message.text}</div>
                                        <img src={userPhoto ? `http://localhost:8080/${userPhoto}` : defaultAvatar} alt="Avatar" className="avatar" />
                                    </>
                                ) : (
                                    <>
                                        <img src={logoImage} alt="Logo" className='logo-png' style={{ width: '50px', height: '50px' }} />
                                        <div className={styles.messageText}>{message.text}</div>
                                    </>
                                )}
                                <div className={styles.messageTimestamp}>{message.timestamp.toLocaleString()}</div>
                            </div>
                        ))}
                    </div>

                    <input className={styles.inputField} value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={handleKeyPress} />
                    <button className={styles.sendButton} onClick={handleSendMessage}>
                        <FontAwesomeIcon icon={faPaperPlane} />
                    </button>
                    <button onClick={handleDisconnect}>Disconnect</button>
                </div>
            </div>
        </div>
    );
};

export default Chat;
