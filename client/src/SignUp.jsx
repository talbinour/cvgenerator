import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SignUp.css';
import { Link } from 'react-router-dom';

const SignUp = () => {
  const navigate = useNavigate();

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

  const [duplicateEmailError, setDuplicateEmailError] = useState('');

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

  const validateForm = () => {
    let valid = true;
    const newErrorMessages = {};

    Object.entries(formData).forEach(([key, value]) => {
      if (value.trim() === '') {
        newErrorMessages[key] = 'Ce champ est obligatoire';
        valid = false;
      } else if (key === 'Nbphone' && (!/^\d+$/.test(value) || value.length < 8)) {
        newErrorMessages[key] = 'Le numéro de téléphone doit avoir au moins 8 chiffres';
        valid = false;
      } else if (key === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        newErrorMessages[key] = 'Adresse e-mail invalide';
        valid = false;
      } else if (key === 'date_naissance') {
        const birthDate = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();

        if (age < 18) {
          newErrorMessages[key] = 'Vous devez avoir au moins 18 ans';
          valid = false;
        }
      }
    });

    setErrorMessages(newErrorMessages);

    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      console.error('Le formulaire contient des erreurs');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/register', formData);

      if (response.data.status === 'ok') {
        console.log('Vérification de l\'e-mail en cours...');
        navigate('/login');
      } else {
        if (response.data.message === 'User already exists...') {
          setDuplicateEmailError('Cette adresse e-mail est déjà enregistrée. Veuillez vous connecter.');
        } else {
          console.error('Erreur d\'inscription:', response.data.message);
        }
      }
    } catch (error) {
      console.error('Erreur d\'inscription:', error.response ? error.response.data.message : error.message);
    }
  };

  return (
    <div className='signup_page '>
      <h2 style={{ textAlign: 'center' }}>Inscription</h2>
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
        {duplicateEmailError && <p style={{ color: 'red' }}>{duplicateEmailError}</p>}

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
        {duplicateEmailError && <p style={{ color: 'red' }}>{duplicateEmailError}</p>}

        <button type="submit">S&apos;inscrire</button>
        <p>Déjà un compte ? <Link to="/login">Connectez-vous ici</Link></p>
      </form>
    </div>
  );
};

export default SignUp;
