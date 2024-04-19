import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';

const DashboardContent = ({ cv }) => {
  const navigate = useNavigate();
  const { Id } = useParams(); // Récupérer cvId et _id depuis les paramètres de l'URL

  const handleEditCV = () => {
    navigate(`/edit-cv/${Id}`); // Utiliser _id également dans la navigation
  };

  // Utilisez l'URL de l'image du CV si cv est défini, sinon affichez un texte alternatif
  const imageUrl = cv && cv.imageURL ? cv.imageURL : '';

  return (
    <>
      <section className='hero'>
        <h1>DashboardContent</h1>
        {/* Image cliquable */}
        <button onClick={handleEditCV}>
          {cv ? <img src={imageUrl} alt='CV' /> : <span>Aucune image disponible</span>}
        </button>
      </section>
    </>
  );
};

// Valider les props
DashboardContent.propTypes = {
  cv: PropTypes.object, // Ne pas marquer comme obligatoire si cv peut être undefined
};

export default DashboardContent;
