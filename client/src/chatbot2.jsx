import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import styles from './chatbot2.module.css';
import logoImage from './assets/chatbot.png';
import defaultAvatar from './assets/user.png';
import { v4 as uuidv4 } from 'uuid';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [userPhoto, setUserPhoto] = useState(null);
    const [userId, setUserId] = useState(null);
    const [conversationId, setConversationId] = useState(null);
    const messageQueueRef = useRef([]); // Store messages to send when conversationId is ready

    const params = useParams();

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await axios.get('http://localhost:8080/current-username', { withCredentials: true });
                    setUserPhoto(response.data.user.photo);
                    setUserId(response.data.user.id || response.data.user.user_id);
                } catch (error) {
                    console.error('Erreur lors de la récupération du nom d\'utilisateur :', error);
                }
            }
        };

        fetchUserData();

        // Set or initialize conversationId from URL or generate a new one
        if (params.conversation_id) {
            setConversationId(params.conversation_id);
        } else {
            const newConversationId = uuidv4();
            setConversationId(newConversationId);
        }
    }, [params]);

    useEffect(() => {
        if (conversationId) {
            loadMessages(conversationId);
        }
    }, [conversationId]);

    const loadMessages = (conversationId) => {
        axios.get(`http://localhost:5000/messages/${conversationId}`)
            .then(response => {
                setMessages(response.data.messages || []);
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

    const saveMessageToBackend = async (message, response, conversationId) => {
        try {
            await axios.post("http://localhost:5000/save-message", {
                message, response, user_id: userId, conversation_id: conversationId
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } catch (error) {
            console.error("Erreur lors de l'enregistrement du message:", error);
        }
    };

    const handleSendMessage = async () => {
        const timestamp = new Date();
        const response = await sendMessage(input);
        const userMessage = { text: input, sender: "user", timestamp };
        const botMessage = { text: response, sender: "bot", timestamp };

        setMessages(prevMessages => [...prevMessages, userMessage, botMessage]);

        if (conversationId) {
            saveMessageToBackend(input, response, conversationId);
        } else {
            messageQueueRef.current.push({ input, response });
        }

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
                                    style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '50%'}}
                                />
                            </div>
                            <div className={styles.messageText}>
                                <div className={`flex-1 rounded-lg p-2 ${message.sender === 'user' ? styles.userMessage : styles.botMessage}`}>
                                    <p>{message.text}</p>
                                </div>
                            </div>
                            <p className="mt-2 text-xs text-gray-500">{new Date(message.timestamp).toLocaleString()}</p>
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
