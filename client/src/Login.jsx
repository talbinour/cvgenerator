import React, { useState, useEffect } from 'react';
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

    try {
      const response = await axios.post('http://localhost:8080/loginuser', requestData, {
        withCredentials: true,
      });

      if (response && response.data) {
        const user = response.data.data.user;

        if (user.role === 'admin') {
          console.log('Redirecting to /admin');
          navigate('/admin');
        } else if (user.role === 'user') {
          console.log('Redirecting to /');
          navigate('/');
        }
      }
    } catch (error) {
      console.error('Login failed', error);

      if (error.response) {
        console.log('Error response data:', error.response.data);
        console.log('Error response status:', error.response.status);

        if (error.response.status === 401) {
          setError('Email ou mot de passe incorrect');
        } else {
          setError("Une erreur s'est produite lors de la connexion.");
        }
      } else if (error.request) {
        console.log('Error request:', error.request);
        setError('Aucune réponse du serveur.');
      } else {
        console.error('Error message:', error.message);
        setError("Une erreur s'est produite lors de la connexion.");
      }
    }
  };

  const loginWithGoogle = () => {
    window.open('http://localhost:8080/auth/google/callback', '_self');
  };

  useEffect(() => {
    const token = 'mLjaK5E6GWwhSv6bSTBCZ0fwa5nphxQOwGLSMOadK5g=';

    axios.get('http://localhost:8080/protected-route', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(response => {
        console.log('Success:', response.data);
        navigate('/dashboard');
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, [navigate]);

  return (
    <div className="login-page">
      <h2 style={{ textAlign: 'center' }}>Connexion</h2>
      <p>veuillez vous authentifier </p>
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
        <p className="message">
          Vous n&apos;avez pas de compte ? <Link to="/signup">Sign Up</Link>
        </p>

        <button className="login-with-google-btn" onClick={loginWithGoogle}>
          Se connecter avec Google
        </button>
      </div>
    </div>
  );
};

export default Login;
