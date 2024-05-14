import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import styles from './chatbot2.module.css';
import logoImage from './assets/chatbot.png';
import defaultAvatar from './assets/user.png';
//import { v4 as uuidv4 } from 'uuid';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [userPhoto, setUserPhoto] = useState(null);
    const [userId, setUserId] = useState(null);
    const [setConversationId] = useState("");
    
    const { conversationId } = useParams();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get('http://localhost:8080/current-username', { withCredentials: true })
                .then(response => {
                    setUserPhoto(response.data.user.photo);
                    setUserId(response.data.user.id || response.data.user.user_id);
                    setConversationId(conversationId);
                    // Une fois que nous avons l'identifiant de la conversation, nous devons charger les messages associés
                    loadMessages(conversationId);
                })
                .catch(error => {
                    console.error('Erreur lors de la récupération du nom d\'utilisateur :', error);
                });
        }
    }, [conversationId]);

    const loadMessages = (conversationId) => {
        // Appel à l'API pour récupérer les messages de la conversation
        axios.get(`http://localhost:5000/messages/${conversationId}`)
            .then(response => {
                setMessages(response.data);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des messages de la conversation :', error);
            });
    };

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

    const saveMessageToBackend = async (message, response) => {
        try {
            const saveResponse = await axios.post("http://localhost:5000/save-message", {
                message, response, user_id: userId, conversation_id: conversationId
            }, {
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
        const userMessage = { text: input, sender: "user", timestamp };
        const botMessage = { text: response, sender: "bot", timestamp };

        saveMessageToList(userMessage);
        saveMessageToList(botMessage);
        saveMessageToBackend(input, response);

        setInput("");
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            handleSendMessage();
        }
    };

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.leftPanel}>
                <div className={styles.container}>
                    <div className={styles.messageContainer}>
                        {messages.map((message, index) => (
                            <div key={index} className={`flex items-start gap-2 ${message.sender === 'user' ? 'justify-end' : ''}`}>
                                <div className={`flex-shrink-0 rounded-full ${message.sender === 'user' ? 'order-2 ml-4' : 'mr-4'}`}>
                                    <img
                                        alt={`${message.sender} Avatar`}
                                        className="rounded-full"
                                        src={message.sender === 'user' ? (userPhoto ? `http://localhost:8080/${userPhoto}` : defaultAvatar) : logoImage}
                                        style={{ width: '48px', height: '48px', objectFit: 'cover' , borderRadius: '50%'}}
                                    />
                                </div>
                                <div className={styles.messageText}>
                                    <div className={`flex-1 rounded-lg p-2 ${message.sender === 'user' ? styles.userMessage : styles.botMessage}`}>
                                        <p>{message.text}</p> 
                                    </div>
                                </div>
                                <p className="mt-2 text-xs text-gray-500">{message.timestamp.toLocaleString()}</p>
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

export default Chat;
