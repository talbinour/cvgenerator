import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./Login.css";
import { Link } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [motPasse, setMotPasse] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    // Check if the entered email and password match the admin credentials
    if (email === 'admin@example.com' && motPasse === 'adminPassword') {
      // Admin credentials are valid, redirect to the admin page
      navigate('/admin');
      return;
    }

    try {
      // Send login data to the server
      const response = await axios.post('http://localhost:8080/api/login', { email, motPasse });

      // Assuming the server responds with a user object including the role upon successful login
      const user = response.data.user;

      // Redirect the user based on their role
      if (user.role === 'admin') {
        navigate('/admin'); // Redirect to the admin page
      } else if (user.role === 'user') {
        navigate('/user'); // Redirect to the user page
      } else {
        console.error('Unknown role:', user.role);
      }
    } catch (error) {
      // Handle login error
      console.error('Login failed', error);
    }
  };

  const loginWithGoogle = ()=>{
    window.open("http://localhost:8080/auth/google/callback","_self")
}


  return (
    <div className="login-page">
      <h2 style={{ textAlign: 'center' }}>Connexion</h2>
      <p>veuiller s'authetifier </p>   
      <div className="form">
        <form className="login-form">
          <label>Email:</label> 
          <input type="email" 
           name="email" 
           placeholder='Entre votre Email' 
           value={email}
           onChange={(e) => setEmail(e.target.value)} />

          <label>Mot de passe:</label>
          <input type="password" 
           placeholder='Entre votre mot de passe '
           value={motPasse}
           onChange={(e) => setMotPasse(e.target.value)} />

          <button type="button" onClick={handleLogin}>
            Connexion 
          </button>

          <p className='message'>Vous n'avez pas de compte ? <Link to="/signup">Sign Up</Link></p>
        </form>

        <button className='login-with-google-btn' 
        onClick={loginWithGoogle}>
        Se connecter avec Google
        </button>

      </div>
    </div>
  );
};

export default Login;
