import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom'; 
import './ApplicationsPage.module.css';
const Applications = () => {
  const [conversations, setConversations] = useState([]);
  const [userId, setUserId] = useState('');
// let navigate = useNavigate();
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
  }, [userId]);

  useEffect(() => {
    // Appel à la route backend pour récupérer les conversations de l'utilisateur
    axios.get(`http://localhost:5000/conversations/${userId}`)
      .then(response => {
        setConversations(response.data);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des conversations :', error);
      });
  }, [userId]); // Ajoutez userId comme dépendance à useEffect pour qu'il se mette à jour lorsque userId change

  return (
    <div>
      <ul>
        {conversations.map(conversation => (
          <li key={conversation.id}>
            <Link to={`/chatbot2/${conversation.conversation_id}`}>{conversation.title}</Link>
            <p>Date : {conversation.date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Applications;
