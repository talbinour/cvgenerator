import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom'; 
import styles from './ApplicationsPage.module.css'; // Import the CSS module

const Applications = () => {
  const [conversations, setConversations] = useState([]);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:8080/current-username', { withCredentials: true })
        .then(response => {
          const userData = response.data.user;
          const userId = userData.id || userData.user_id;
          setUserId(userId);
        })
        .catch(error => {
          console.error('Erreur lors de la récupération des informations utilisateur:', error);
        });
    }
  }, []);

  useEffect(() => {
    if (userId) {
      axios.get(`http://localhost:5000/conversations/${userId}`)
        .then(response => {
          setConversations(response.data);
        })
        .catch(error => {
          console.error('Erreur lors de la récupération des conversations :', error);
        });
    }
  }, [userId]);

  return (
    <div className={styles.container}>
      <h1>Historique des conversations</h1>
      <ul>
        {conversations.map(conversation => (
          <li key={conversation.id} className={styles.conversation}>
            <Link to={`/chatbot2/${conversation.conversation_id}`}>{conversation.title}</Link>
            <p>Date : {conversation.date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Applications;
