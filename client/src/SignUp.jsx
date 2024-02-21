import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SignUp.css';
import { Link } from 'react-router-dom';

const SignUp = () => {
  const navigate = useNavigate();
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    mot_passe: '',
    date_naissance: '',
    Nbphone: '',
  });

  const [errorMessages, setErrorMessages] = useState({
    nom: '',
    prenom: '',
    email: '',
    date_naissance: '',
    Nbphone: '',
    mot_passe: '',
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessages({ ...errorMessages, [e.target.name]: '' });

    if (e.target.name === 'Nbphone') {
      const phoneNumber = e.target.value.replace(/\D/g, '');
      if (phoneNumber.length > 8) {
        e.target.value = phoneNumber.slice(0, 8);
        setFormData({ ...formData, Nbphone: phoneNumber.slice(0, 8) });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8080/register', formData);

      if (response.status === 200) {
        // Affichage du message de confirmation sur la page
        setConfirmationMessage('Un e-mail de confirmation a été envoyé. Veuillez vérifier votre boîte de réception.');

        // Redirection vers la page de connexion après un court délai
        setTimeout(() => {
          navigate('/login');
        }, 3000); // Redirection après 3 secondes
      } else {
        console.error('Erreur lors de l\'inscription:', response.data.message);
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error.response ? error.response.data.message : error.message);
    }
  };
  return (
    <div className='signup_page '>
      <h2 style={{ textAlign: 'center' }}>Inscription</h2>
      {confirmationMessage && <p style={{ color: 'green' }}>{confirmationMessage}</p>}
      <form onSubmit={handleSubmit}>
        <label className="required-label">Nom:</label>
        <input
          type="text"
          name="nom"
          placeholder='Entre votre nom ..'
          value={formData.nom}
          onChange={handleInputChange}
          required
        />
        {errorMessages.nom && <p style={{ color: 'red' }}>{errorMessages.nom}</p>}

        <label className="required-label">Prénom:</label>
        <input
          type="text"
          name="prenom"
          placeholder='Entre votre prénom ..'
          value={formData.prenom}
          onChange={handleInputChange}
          required
        />
        {errorMessages.prenom && <p style={{ color: 'red' }}>{errorMessages.prenom}</p>}

        <label className="required-label">Email:</label>
        <input
          type="email"
          name="email"
          placeholder='Entre votre Email ..'
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        {errorMessages.email && <p style={{ color: 'red' }}>{errorMessages.email}</p>}

        <label className="required-label">Date de naissance:</label>
        <input
          type="date"
          name="date_naissance"
          value={formData.date_naissance}
          onChange={handleInputChange}
          required
        />
        {errorMessages.date_naissance && <p style={{ color: 'red' }}>{errorMessages.date_naissance}</p>}

        <label className="required-label">Numéro de téléphone:</label>
        <input
          type="tel"
          name="Nbphone"
          placeholder='Entre votre numéro de téléphone  '
          value={formData.Nbphone}
          onChange={handleInputChange}
          required
        />
        {errorMessages.Nbphone && <p style={{ color: 'red' }}>{errorMessages.Nbphone}</p>}

        <label className="required-label">Mot de passe:</label>
        <input
          type="password"
          name="mot_passe"
          placeholder='Entre votre mot de passe '
          value={formData.mot_passe}
          onChange={handleInputChange}
          required
        />
        {errorMessages.mot_passe && <p style={{ color: 'red' }}>{errorMessages.mot_passe}</p>}

        <button type="submit">S&apos;inscrire</button>
        <p>Déjà un compte ? <Link to="/login">Connectez-vous ici</Link></p>
      </form>
    </div>
  );
};

export default SignUp;
