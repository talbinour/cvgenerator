import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faMicrophone, faMicrophoneSlash } from '@fortawesome/free-solid-svg-icons';
import { faVolumeUp } from '@fortawesome/free-solid-svg-icons'; // Import de l'icône de volume
import styles from './chatbot2.module.css';
import logoImage from '../assets/chatbot.png';
import defaultAvatar from '../assets/user.png';
import { v4 as uuidv4 } from 'uuid';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [userPhoto, setUserPhoto] = useState(null);
    const [userId, setUserId] = useState(null);
    const [conversationId, setConversationId] = useState(null);
    const [isListening, setIsListening] = useState(false);
    const messageQueueRef = useRef([]);
    const recognition = useRef(null);
    const speechSynthesis = useRef(window.speechSynthesis); // Utilisation d'une référence pour conserver l'instance de la synthèse vocale

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
                const newMessages = response.data.messages.flatMap(msg => {
                    const userMessage = {
                        text: msg.user_message,
                        sender: 'user',
                        timestamp: new Date(msg.timestamp)
                    };
    
                    const botMessage = {
                        text: msg.bot_response,
                        sender: 'bot',
                        timestamp: new Date(msg.timestamp)
                    };
    
                    return [userMessage, botMessage];
                });
                
                setMessages(prevMessages => [...prevMessages, ...newMessages]);

                const lastBotMessage = newMessages.find(msg => msg.sender === 'bot');
                if (lastBotMessage) {
                    speak(lastBotMessage.text);
                }
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des messages de la conversation :', error);
            });
    };
    
    const toggleRecognition = () => {
        if (!isListening) {
            startRecognition();
        } else {
            stopRecognition();
        }
    };

    const startRecognition = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert("La reconnaissance vocale n'est pas prise en charge dans ce navigateur.");
            return;
        }
        
        recognition.current = new window.webkitSpeechRecognition();
        recognition.current.lang = "fr-FR";

        recognition.current.onresult = (event) => {
            const currentTranscript = event.results[0][0].transcript;
            setInput(currentTranscript);
        };

        recognition.current.onend = () => {
            setIsListening(false);
        };

        recognition.current.start();
        setIsListening(true);
    };

    const stopRecognition = () => {
        recognition.current.stop();
        setIsListening(false);
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

    const speak = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        speechSynthesis.current.speak(utterance);
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
                    {/* Bouton pour activer/désactiver la reconnaissance vocale */}
                    <button onClick={toggleRecognition}>
                        <FontAwesomeIcon icon={isListening ? faMicrophoneSlash : faMicrophone} />
                    </button>
                    {/* Bouton pour activer la synthèse vocale */}
                    <button className={styles.listenButton} onClick={() => speak(messages[messages.length - 1].text)}>
                        <FontAwesomeIcon icon={faVolumeUp} />
                    </button>
                    <input
                        className={styles.inputField}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <button className={styles.sendButton} onClick={handleSendMessage}>
                        <FontAwesomeIcon icon={faPaperPlane} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat;

