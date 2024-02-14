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
        navigate('/login');
      } else {
        console.error('Erreur d\'inscription:', response.data.message);
      }
    } catch (error) {
      console.error('Erreur d\'inscription:', error.response ? error.response.data.message : error.message);
    }
  };

  return (
    <div className='signup_page '>
      <h2 style={{ textAlign: 'center' }} >Inscription</h2>
      <form onSubmit={handleSubmit}>
          <label>Nom:</label>
          <input type="text" 
          name="nom"
          placeholder='Entre votre nom ..  '
          value={formData.nom} 
          onChange={handleInputChange} required />
        
          <label>Prénom:</label>
          <input type="text" 
          name="prenom" 
          placeholder='Entre votre prenom ..'
          value={formData.prenom} 
          onChange={handleInputChange} required />
        
          <label>Email:</label>
          <input type="email" 
          name="email" 
          placeholder='Entre votre Email .. '
          value={formData.email} 
          onChange={handleInputChange} required />
        
          <label>Date de naissance:</label>

          <input type="date"
          name="date_naissance" 
          value={formData.date_naissance} 
          onChange={handleInputChange} required  />
       
          <label>Numéro de téléphone:</label>
          <input type="tel" 
          name="Nbphone" 
          placeholder='Entre votre numéro de telephone  '
          value={formData.Nbphone} 
          onChange={handleInputChange} required />
     
          <label>Mot de passe:</label>
          <input type="password" 
          name="mot_passe" 
          placeholder='Entre votre mot de passe '
          value={formData.mot_passe} 
          onChange={handleInputChange} required />
     
        <button type="submit">S&apos;inscrire</button>
      </form>
    </div>
  );
};

export default SignUp;