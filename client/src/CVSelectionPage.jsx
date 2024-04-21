import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CVSelectionPage.module.css'; // Importez votre fichier CSS
import { useNavigate } from 'react-router-dom';

const CVSelectionPage = () => {
  const [CVList, setCVList] = useState([]);
  const navigate = useNavigate(); // Utilisez useNavigate() ici

  useEffect(() => {
    const fetchCVs = async () => {
      try {
        const response = await axios.get('http://localhost:8080/getCVs');
        // Dupliquez la liste pour créer un effet de boucle circulaire
        setCVList([...response.data, ...response.data]);
      } catch (error) {
        console.error("Failed to fetch CVs:", error);
      }
    };

    fetchCVs();
  }, []);

  const handleCVSelection = async (cvId) => {
    try {
      const response = await axios.get(`http://localhost:8080/getCVById/${cvId}`);
      const selectedCV = response.data;
      // Rediriger vers l'interface de chatbot avec l'ID du CV sélectionné
      navigate(`/chatbot/${selectedCV._id}`);
    } catch (error) {
      console.error("Failed to fetch selected CV:", error);
    }
  };

  return (
    <div className="CVSelectionPage-container">
      <h2 className="CVSelectionPage-title">Sélectionnez un modèle de CV</h2>
      <div className="CVSelectionPage-cvContainer">
        {CVList.map((cv) => (
          <div key={cv._id} className="CVSelectionPage-cvItem" onClick={() => handleCVSelection(cv._id)}>
            <img src={cv.imageURL} alt={`CV ${cv._id}`} className="CVSelectionPage-cvImage" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CVSelectionPage;
