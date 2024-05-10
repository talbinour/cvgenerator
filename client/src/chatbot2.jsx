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
    const [userPhoto, setUserPhoto] = useState(null); // Définition de l'état pour userPhoto
    //const [setShowProfileMenu] = useState(false); // Définition de l'état pour showProfileMenu
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get('http://localhost:8080/current-username', { withCredentials: true })
                .then(response => {
                    setUserPhoto(response.data.user.photo);
                    setUserId(response.data.user.id || response.data.user.user_id); // Utilisation de userId au lieu de user_id
                })
                .catch(error => {
                    console.error('Erreur lors de la récupération du nom d\'utilisateur :', error);
                });
        }
    }, []); // Le tableau vide assure que cette fonction useEffect ne sera exécutée qu'une seule fois après le rendu initial

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
        const timestamp = new Date(); // Obtenir le timestamp actuel
        const response = await sendMessage(input);
        const userMessage = { text: input, user: "me", timestamp, user_id: userId }; // Message de l'utilisateur
        const botMessage = { text: response, user: "Cevor", timestamp, user_id: userId }; // Réponse du bot
    
        let updatedMessages = [...messages];
        const lastMessageIndex = updatedMessages.length - 1;
    
        // Vérifier si le dernier message est du même utilisateur
        if (
            lastMessageIndex >= 0 &&
            updatedMessages[lastMessageIndex].user_id === userId
        ) {
            // Si oui, ajouter simplement le nouveau message à la discussion existante
            updatedMessages.push(userMessage, botMessage);
        } else {
            // Sinon, créer une nouvelle discussion avec le nouveau message
            updatedMessages.push(userMessage, botMessage);
        }
    
        // Mettre à jour l'état des messages avec la discussion mise à jour
        setMessages(updatedMessages);
    
        // Enregistrer le message de l'utilisateur et la réponse du bot vers le backend
        saveMessageToBackend({ message: input, response, user_id: userId });
    
        // Réinitialiser l'entrée utilisateur après l'envoi du message
        setInput("");
    };
    

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            handleSendMessage(); // Appeler handleSendMessage lorsque la touche Entrée est enfoncée
        }
    };

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.leftPanel}>
                <div className={styles.container}>
                <div className={styles.messageContainer}>
                        {messages.map((message, index) => (
                            <div key={index} className={`${styles.message} ${message.user === 'me' ? styles.me : styles.bot}`}>
                                {message.user === 'me' && <img src={userPhoto ? `http://localhost:8080/${userPhoto}` : defaultAvatar} alt="Avatar" className="avatar"  />}
                                {message.user === 'Cevor' && <img src={logoImage} alt="Logo" className='logo-png' style={{ width: '50px', height: '50px' }} />}
                                <div className={styles.messageText}>{message.text}</div>
                                <div className={styles.messageTimestamp}>{message.timestamp.toLocaleString()}</div> {/* Ajout du timestamp */}
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
