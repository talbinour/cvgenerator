import React, { useState, useEffect , useRef} from "react";
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
    const [conversationId, setConversationId] = useState("");
    const messageQueueRef = useRef([]); // Store messages to send when conversationId is ready

 
    const { conversationId: paramConversationId } = useParams();

    useEffect(() => {
        console.log("Paramètre de l'URL conversationId:", paramConversationId); // Log de l'ID de conversation

        const token = localStorage.getItem('token');
        if (token) {
            axios.get('http://localhost:8080/current-username', { withCredentials: true })
                .then(response => {
                    setUserPhoto(response.data.user.photo);
                    setUserId(response.data.user.id || response.data.user.user_id);
                    if (paramConversationId) {
                        console.log("Utilisation de paramConversationId pour définir conversationId:", paramConversationId); // Log de l'ID de conversation à utiliser
                        setConversationId(paramConversationId);
                        loadMessages(paramConversationId);
                    } else {
                        const newConversationId = uuidv4();
                        console.log("Génération d'un nouvel ID de conversation:", newConversationId); // Log du nouvel ID de conversation généré
                        setConversationId(newConversationId);
                        processMessageQueue(newConversationId);
                    }
                })
                .catch(error => {
                    console.error('Erreur lors de la récupération du nom d\'utilisateur :', error);
                });
        }
    }, [paramConversationId]);

    useEffect(() => {
        if (conversationId) {
            console.log("Chargement des messages pour conversationId:", conversationId); // Log de l'ID de conversation pour le chargement des messages
            loadMessages(conversationId);
        }
    }, [conversationId]);

    const loadMessages = (conversationId) => {
        console.log("Requête GET pour récupérer les messages de la conversation:", conversationId); // Log de la requête GET
        axios.get(`http://localhost:5000/messages/${conversationId}`)
            .then(response => {
                console.log("Réponse de la requête GET:", response.data); // Log de la réponse de la requête GET
                setMessages(response.data.messages || []);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des messages de la conversation :', error);
            });
    };

    const processMessageQueue = (conversationId) => {
        const queue = messageQueueRef.current;
        queue.forEach(({ message, response }) => {
            saveMessageToBackend(message, response, conversationId);
        });
        messageQueueRef.current = [];
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
