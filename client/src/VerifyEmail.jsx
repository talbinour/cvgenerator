import  { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Remplacer useHistory par useNavigate
import axios from 'axios';

const VerifyEmail = () => {
  const { emailToken } = useParams();
  const navigate = useNavigate(); // Utilisez useNavigate pour gérer la navigation

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/verify-email/${emailToken}`);

        if (response.data.success) {
          // Affichage de l'alerte de confirmation
          alert('Votre adresse e-mail a été vérifiée avec succès.');
          // Redirection vers la page d'accueil après la validation réussie
          navigate('/'); // Mettre à jour ici
        } else {
          // Affichage d'une alerte en cas d'échec de la validation
          alert(response.data.message);
          // Redirection vers la page d'accueil en cas d'échec de la validation
          navigate('/'); // Mettre à jour ici
        }
      } catch (error) {
        console.error('Erreur lors de la validation du compte:', error.message);
        // Affichage d'une alerte en cas d'erreur
        alert('Une erreur est survenue lors de la validation du compte. Veuillez réessayer plus tard.');
        // Redirection vers la page d'accueil en cas d'erreur
        navigate('/'); // Mettre à jour ici
      }
    };

    verifyEmail();
  }, [emailToken, navigate]); // Mettre à jour les dépendances ici

  return null; // Pas besoin d'afficher quoi que ce soit dans cette page
};

export default VerifyEmail;
