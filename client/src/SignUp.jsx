import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { CountryDropdown } from 'react-country-region-selector';
import './SignUp.css';

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    mot_passe: '',
    date_naissance: '',
    Nbphone: '',
    country: '', // Nouvel état pour le pays
    genre: '', // Nouvel état pour le genre
  });

  const [errorMessages, setErrorMessages] = useState({
    nom: '',
    prenom: '',
    email: '',
    date_naissance: '',
    Nbphone: '',
    mot_passe: '',
    country: '',
    genre: '', // Nouvel état pour le genre
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
      } else if (key === 'country' && value === '') {
        newErrorMessages[key] = 'Veuillez sélectionner votre pays';
        valid = false;
      } else if (key === 'genre' && value === '') {
        newErrorMessages[key] = 'Veuillez sélectionner votre genre';
        valid = false;
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
      const { nom, prenom, email, date_naissance, mot_passe, Nbphone, genre, country } = formData;
      const response = await axios.post('http://localhost:8080/register', {
        nom,
        prenom,
        email,
        date_naissance,
        mot_passe,
        Nbphone,
        genre,
        pays: country,
      });
      if (response.status === 200) {
        alert('Un e-mail de confirmation a été envoyé. Veuillez vérifier votre boîte de réception.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else if (response.status === 409) {
        // L'utilisateur existe déjà dans la base de données
        alert('L\'utilisateur avec cette adresse e-mail existe déjà.');
      }
       else {
        console.error('Erreur d\'inscription:', response.data.message);
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Erreur d\'inscription:', error.response ? error.response.data.message : error.message);
    }
  };

  const handleEmailVerification = async () => {
    const emailToken = new URLSearchParams(window.location.search).get('emailToken');

    try {
      const response = await axios.get(`http://localhost:8080/verify-email/${emailToken}`);
      alert(response.data.message);
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'e-mail:', error.response ? error.response.data.message : error.message);
    }
  };

  useEffect(() => {
    handleEmailVerification();
  }, []);

  return (
    <div className='signup_page'>
      <h2 style={{ textAlign: 'center' }}>Inscription</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="required-label">Nom:</label>
          <input
            type="text"
            name="nom"
            placeholder='Entre votre nom ..  '
            value={formData.nom}
            onChange={handleInputChange}
            required
          />
          {errorMessages.nom && <p style={{ color: 'red' }}>{errorMessages.nom}</p>}
        </div>

        <div className="form-group">
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
        </div>

        <div className="form-group">
          <label className="required-label">Email:</label>
          <input
            type="email"
            name="email"
            placeholder='Entre votre Email .. '
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          {errorMessages.email && <p style={{ color: 'red' }}>{errorMessages.email}</p>}
        </div>

        <div className="form-group">
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
        </div>

        <div className="form-group">
          <label className="required-label">Pays:</label>
          <CountryDropdown
            value={formData.country}
            onChange={(val) => setFormData({ ...formData, country: val })}
            required
            className="country-dropdown"
          />
          {errorMessages.country && <p style={{ color: 'red' }}>{errorMessages.country}</p>}
        </div>

        <div className="form-group">
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
        </div>

        <div className="form-group">
          <label className="required-label">Date de naissance:</label>
          <input
            type="date"
            name="date_naissance"
            value={formData.date_naissance}
            onChange={handleInputChange}
            required
          />
          {errorMessages.date_naissance && <p style={{ color: 'red' }}>{errorMessages.date_naissance}</p>}
        </div>

        <div className="form-group">
          <label className="required-label">Genre:</label>
          <select
            name="genre"
            value={formData.genre}
            onChange={handleInputChange}
            required
          >
            <option value="">Sélectionner le genre</option>
            <option value="homme">Homme</option>
            <option value="femme">Femme</option>
          </select>
          {errorMessages.genre && <p style={{ color: 'red' }}>{errorMessages.genre}</p>}
        </div>

        <button type="submit">S&apos;inscrire</button>
        <p>Déjà un compte ? <Link to="/login">Connectez-vous ici</Link></p>
      </form>
    </div>
  );
};

export default SignUp;
