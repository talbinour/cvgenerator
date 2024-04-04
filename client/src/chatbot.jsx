import React, { useState } from "react";
import styles from './chatbot.module.css'; // Import CSS module

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const sendMessage = async (message) => {
        const response = await fetch("http://localhost:5000/chat", { // Modifier l'URL en fonction du port de votre serveur Flask
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message })
        });
        const data = await response.json();
        return data.response;
    };
    

    const handleSendMessage = async () => {
        const response = await sendMessage(input);
        setMessages([...messages, { text: input, user: "me" }, { text: response, user: "bot" }]);
        setInput("");
    };

    return (
        <div className={styles.container}> {/* Applying className */}
            <div className={styles.messageContainer}> {/* Applying className */}
                {messages.map((message, index) => (
                    <div key={index} className={`${styles.message} ${message.user === 'me' ? styles.me : styles.bot}`}>
                        {/* Applying className conditionally */}
                        {message.user}: {message.text}
                    </div>
                ))}
            </div>
            <input className={styles.inputField} value={input} onChange={(e) => setInput(e.target.value)} /> {/* Applying className */}
            <button className={styles.sendButton} onClick={handleSendMessage}>Send</button> {/* Applying className */}
        </div>
    );
};

export default Chat;
