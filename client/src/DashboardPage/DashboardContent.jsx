import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [currentUserCV, setCurrentUserCV] = useState(null);
  const [userId, setUserId] = useState(null);
  const [cvId, setCvId] = useState(null);

  useEffect(() => {
    const fetchCvId = async () => {
      try {
        if (!cvId) return; // Vérifiez que cvId n'est pas null

        const response = await axios.get(`http://localhost:8080/getCVById/${cvId}`);
        const data = response.data;
        setCvId(data._id); // Suppose que votre réponse contient un champ cvId
      } catch (error) {
        console.error('Error fetching CV ID:', error);
      }
    };

    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get('http://localhost:8080/current-username', { withCredentials: true })
        .then((response) => {
          const userData = response.data.user;
          const userId = userData.id || userData.user_id;
          setUserId(userId);
        })
        .catch((error) => {
          console.error('Erreur lors de la récupération des informations utilisateur:', error);
        });
    }

    const fetchCurrentUserCV = async () => {
      try {
        if (!userId) return;

        const response = await axios.get(`http://localhost:8080/user/${userId}/cv/${cvId}`);
        const currentUserCVData = response.data;
        setCurrentUserCV(currentUserCVData);
      } catch (error) {
        console.error('Error fetching current user CV:', error);
      }
    };

    fetchCurrentUserCV();
    fetchCvId(); // Correction de l'appel à fetchCvId
  }, [userId, cvId]);

  return (
    <div>
      <h1>Dashboard</h1>
      {currentUserCV ? (
        <div>
          <h2>{currentUserCV.title}</h2>
          <p>{currentUserCV.description}</p>
          <img src={currentUserCV.imageUrl} alt="CV" />
        </div>
      ) : (
        <p>No CV available for the current user</p>
      )}
    </div>
  );
};

export default Dashboard;
