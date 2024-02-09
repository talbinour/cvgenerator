// SignUp.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8080/register', formData);

      if (response.data.status === 'ok') {
        navigate('/');
      } else {
        console.error('Erreur d\'inscription:', response.data.message);
      }
    } catch (error) {
      console.error('Erreur d\'inscription:', error.response ? error.response.data.message : error.message);
    }
  };

  return (
    <div>
      <h2>Inscription</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nom:</label>
          <input type="text" name="nom" value={formData.nom} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Prénom:</label>
          <input type="text" name="prenom" value={formData.prenom} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Date de naissance:</label>

          <input type="date" name="date_naissance" value={formData.date_naissance} onChange={handleInputChange} required  />
        </div>
        <div>
          <label>Numéro de téléphone:</label>
          <input type="tel" name="Nbphone" value={formData.Nbphone} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Mot de passe:</label>
          <input type="password" name="mot_passe" value={formData.mot_passe} onChange={handleInputChange} required />
        </div>
        <button type="submit">S'inscrire</button>
      </form>
    </div>
  );
};

export default SignUp;