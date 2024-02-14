import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [mot_passe, setMotPasse] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestData = {
      email: email,
      mot_passe: mot_passe,
    };

    console.log('Request Data:', requestData);

    try {
      const response = await axios.post('http://localhost:8080/loginuser', requestData, {
        withCredentials: true,
      });

      console.log('Response:', response);

      const responseData = response.data;

      if (responseData.status === 'ok' && responseData.role === 'admin') {
        console.log('Redirecting to /admin');
        navigate('/admin');
      } else if (responseData.status === 'ok' && responseData.role === 'user') {
        console.log('Redirecting to /dashboard');
        navigate('/dashboard');
      } else {
        console.log('Unknown user or role:', responseData);
        // Ajoutez une redirection par défaut ici si nécessaire
        navigate('/default-route');
      }
    } catch (error) {
      console.error('Login failed', error);
      console.log('Response Data:', error.response ? error.response.data : 'No response data');

      setError('Une erreur s\'est produite lors de la connexion.');
      // Vous pourriez réinitialiser l'erreur après un certain temps ou lorsque l'utilisateur commence à taper.
    }
  };

  const loginWithGoogle = () => {
    window.open('http://localhost:8080/auth/google/callback', '_self');
  };

  return (
    <div className="login-page">
      <h2 style={{ textAlign: 'center' }}>Connexion</h2>
      <p style={{ textAlign: 'center' }} >veuillez vous authentifier </p>
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

          <button type="submit">Connexion</button>
        </form>
        <p className="message"  style={{ textAlign: 'center' }}><Link to="/signup">Oublier mot de passe ?</Link>
        </p>

        
        <button className="login-with-google-btn" onClick={loginWithGoogle}>
          Se connecter avec Google
        </button>
        <p className="message">
          Vous n&apos;avez pas de compte ? <Link to="/signup">Sign Up</Link>
        </p>

      </div>
    </div>
  );
};

export default Login;
