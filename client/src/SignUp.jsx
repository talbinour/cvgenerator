import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { CountryDropdown } from 'react-country-region-selector';
import './SignUp.css';
import ReactCountryFlag from 'react-country-flag';
import { getCountryCallingCode, getCountries } from 'libphonenumber-js';
import Swal from 'sweetalert2'; // Importez SweetAlert2

const SignUp = () => {
  const navigate = useNavigate();
  // Dynamically fetch phone codes
  const getAllCountriesWithPhoneCodes = () => {
  const countries = getCountries();
  const countriesWithPhoneCodes = {};
  countries.forEach((country) => {
    const countryCode = country.alpha2;
    try {
      const phoneCode = getCountryCallingCode(countryCode);
      countriesWithPhoneCodes[countryCode] = phoneCode !== undefined ? `+${phoneCode}` : '+';
    } catch (error) {
      console.error('Error fetching phone code for country:', country);
      countriesWithPhoneCodes[countryCode] = '+'; // Provide a default value '+'
    }
  });

  return countriesWithPhoneCodes;
};


// Initialize phoneCodes
const phoneCodes = getAllCountriesWithPhoneCodes();


  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    mot_passe: '',
    date_naissance: '',
    Nbphone: '',
    country: '', 
    genre: '', 
    profession: '',
  });

  const [errorMessages, setErrorMessages] = useState({
    nom: '',
    prenom: '',
    email: '',
    date_naissance: '',
    Nbphone: '',
    mot_passe: '',
    country: '',
    genre: '', 
    profession:'',

  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessages({ ...errorMessages, [e.target.name]: '' });

    if (e.target.name === 'Nbphone') {
      const phoneNumber = e.target.value.replace(/\D/g, '');
      setFormData({ ...formData, Nbphone: phoneNumber });
    }
    
  };

  const validateForm = () => {
    let valid = true;
    const newErrorMessages = {};

    Object.entries(formData).forEach(([key, value]) => {
      if (value.trim() === '') {
        newErrorMessages[key] = 'Ce champ est obligatoire';
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
      const { nom, prenom, email, date_naissance, mot_passe, Nbphone, genre, country ,profession} = formData;
      const response = await axios.post('http://localhost:8080/register', {
        nom,
        prenom,
        email,
        date_naissance,
        mot_passe,
        Nbphone,
        profession,
        genre,
        pays: country,
      });
      if (response.status === 200) {
        Swal.fire({
          title: 'Succès',
          text: 'Un e-mail de confirmation a été envoyé. Veuillez vérifier votre boîte de réception.',
          icon: null // Supprime l'icône de l'alerte
        }).then(() => {
          navigate('/login');
        });
      } else if (response.status === 400) {
        // L'utilisateur existe déjà dans la base de données
        setErrorMessages({ ...errorMessages, email: 'L\'utilisateur avec cette adresse e-mail existe déjà.' });
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
      <div className="glass-container w-70">
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
  <label className="required-label">Numéro de téléphone:</label>
  <div className="phone-input-container">
    {formData.country ? (
      <div className="country-info">
        <ReactCountryFlag
          countryCode={formData.country}
          svg
          style={{
            width: '1.5em', // Adjusted size of the country flag
            height: '1.5em', // Adjusted size of the country flag
            marginRight: '10px',
          }}
        />
        <span className="phone-code">+{phoneCodes[formData.country]}</span>
      </div>
    ) : null}
    <CountryDropdown
      value={formData.country}
      onChange={(val) => {
        setFormData({ ...formData, country: val });
        if (val) {
          setFormData({
            ...formData,
            country: val,
            Nbphone: `+${phoneCodes[val]}`
          });
        } else {
          setFormData({
            ...formData,
            country: '',
            Nbphone: ''
          });
        }
      }}
      valueType="short"
      name="country"
      required
      className="country-dropdown"
    />
    <input
      type="tel"
      name="Nbphone"
      placeholder='Entre votre numéro de téléphone'
      value={formData.Nbphone}
      onChange={handleInputChange}
      required
      className="phone-input"
    />
  </div>
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
        <label className="required-label">Profession:</label>
        <input
          type="text"
          name="profession"
          placeholder='Entrez votre profession'
          value={formData.profession}
          onChange={handleInputChange}
          required
        />
        {errorMessages.profession && <p style={{ color: 'red' }}>{errorMessages.profession}</p>}

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
    </div>
  );
};

export default SignUp;
