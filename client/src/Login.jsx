import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
//import { useAuth } from './AuthContext';
const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [mot_passe, setMotPasse] = useState('');
  const [error, setError] = useState(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const [buttonBlocked, setButtonBlocked] = useState(false);
  //const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // If the login button is blocked, don't proceed
    if (buttonBlocked) {
      return;
    }

    const requestData = {
      email: email,
      mot_passe: mot_passe,
    };

    try {
      const response = await axios.post('http://localhost:8080/loginuser', requestData, {
        withCredentials: true,
      });

      const responseData = response.data;

      if (responseData.status === 'ok' && responseData.role === 'admin') {
        navigate('/admin');
      } else if (responseData.status === 'ok' && responseData.role === 'user') {
        navigate('/dashboard');
      } else {
        navigate('/default-route');
      }
    } catch (error) {
      console.error('Login failed', error);
      console.log('Response Data:', error.response ? error.response.data : 'No response data');

      if (error.response && error.response.status === 401) {
        setError('Mot de passe incorrect ou utilisateur inexistant.');
        setAttemptCount(attemptCount + 1);

        // If the number of attempts reaches 3, block the login button
        if (attemptCount + 1 >= 3) {
          setButtonBlocked(true);
        }
      } else {
        setError('Une erreur s\'est produite lors de la connexion.');
      }
    }
  };

  const loginWithGoogle = () => {
    window.open('http://localhost:8080/auth/google/callback', '_self');
  };

  return (
    <div className="login-page">
      <h2 style={{ textAlign: 'center' }}>Connexion</h2>
      <p style={{ textAlign: 'center' }}>Veuillez vous authentifier</p>
      <div className="form">
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form className="login-form" onSubmit={handleSubmit}>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            placeholder="Entrez votre Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Mot de passe:</label>
          <input
            type="password"
            placeholder="Entrez votre mot de passe "
            value={mot_passe}
            onChange={(e) => setMotPasse(e.target.value)}
          />

          <button type="submit" disabled={buttonBlocked}>
            Connexion
          </button>
        </form>
        <p className="message" style={{ textAlign: 'center' }}>
          <Link to="/password-reset">Mot de passe oublié ?</Link>
        </p>

        <button className="login-with-google-btn" onClick={loginWithGoogle}>
          Se connecter avec Google
        </button>
        <p className="message">
          Vous n&apos;avez pas de compte ? <Link to="/signup">S&apos;inscrire</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
