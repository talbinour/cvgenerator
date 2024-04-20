import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';

const DashboardContent = ({ cv }) => {
  const navigate = useNavigate();
  const { Id } = useParams(); // Récupérer cvId et _id depuis les paramètres de l'URL

  const handleEditCV = () => {
    navigate(`/edit-cv/${Id}`); // Utiliser _id également dans la navigation
  };

  // Valider que cv est bien un objet et qu'il contient une propriété imageURL
  const imageUrl = cv && typeof cv === 'object' && cv.imageURL ? cv.imageURL : '';

  return (
    <section className='hero'>
      <h1>DashboardContent</h1>
      {/* Image cliquable */}
      <button onClick={handleEditCV}>
        <img src={imageUrl} alt='CV' />
      </button>
    </section>
  );
};

// Valider les props
DashboardContent.propTypes = {
  cv: PropTypes.shape({
    imageURL: PropTypes.string // Assurez-vous que imageURL est une chaîne de caractères
  }).isRequired, // Assurez-vous que cv est un objet contenant les données du CV
};

export default DashboardContent;
