import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [mot_passe, setMotPasse] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8080/loginuser', { email, mot_passe }, { withCredentials: true });
      console.log('Server Response:', response.data);

      if (response && response.data) {
        const user = response.data.user;
        console.log('User Object:', user);

        if (user.role === 'admin') {
          navigate('/admin');
        } else if (user.role === 'user') {
          navigate('/dashboard'); // Update the route based on your application
        } else {
          console.error('Unknown role:', user.role);
        }
      } else {
        console.error('Invalid response format');
      }
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const loginWithGoogle = () => {
    window.open('http://localhost:8080/auth/google/callback', '_self');
  };

  return (
    <div className="login-page">
      <h2 style={{ textAlign: 'center' }}>Connexion</h2>
      <p>veuillez vous authentifier </p>
      <div className="form">
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

          <button type="submit">Connexion</button>
        </form>
        <p className="message">
          Vous n&apos;'avez pas de compte ? <Link to="/signup">Sign Up</Link>
        </p>

        <button className="login-with-google-btn" onClick={loginWithGoogle}>
          Se connecter avec Google
        </button>
      </div>
    </div>
  );
};

export default Login;
