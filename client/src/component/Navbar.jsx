import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import logoImage from '../assets/cevor-high-resolution-logo-transparent (1).png';
import axios from 'axios';
import './navbar.css';

const Navbar = () => {
  const [mobile, setMobile] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [loadingLogout, setLoadingLogout] = useState(false);
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
  
    if (token) {
      axios.get('http://localhost:8080/current-username', { withCredentials: true })
        .then(response => {
          setCurrentUser(response.data.user.nom);
        })
        .catch(error => {
          console.error('Erreur lors de la récupération du nom d\'utilisateur :', error);
        });
    }
  }, []);

  const handleLogout = async () => {
    try {
      setLoadingLogout(true);
      await axios.get('http://localhost:8080/logout', { withCredentials: true });
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setLoadingLogout(false);
      setCurrentUser(null); // Set currentUser to null after logout
    }
  };

  return (
    <>
      <nav className='navbar'>
        <img src={logoImage} alt="Logo-png" className='logo-png' style={{ position: "sticky", left: '2', width: '5%', height: '50px' }} />

        <ul className={mobile ? "nav-links-mobile" : "nav-links"} onClick={() => setMobile(false)}>
          <Link to='/' className='home'>
            <li>accueil</li>
          </Link>
          <Link to='/about' className='about'>
            <li>à propos</li>
          </Link>
          <Link to='/services' className='services'>
            <li>Services</li>
          </Link>
          <Link to='/skills' className='skills'>
            <li>Test</li>
          </Link>
          {currentUser && (
            <li className="profile-menu">
              <div className="user-info-container" onClick={() => setShowProfileMenu(!showProfileMenu)}>
              <span className="profile-icon" role="img" aria-label="User Icon">👤</span>
              <span className="username">{currentUser}</span>
              </div>
            </li>
          )}
          {!currentUser && (
            <li>
              <Link to='/login'>
                <button>Connexion</button>
              </Link>
            </li>
          )}
        </ul>
        <button className='mobile-menu-icon' onClick={() => setMobile(!mobile)}>
          {mobile ? <ImCross /> : <FaBars />}
        </button>
      </nav>

      {showProfileMenu && currentUser && (
        <div className="profile-menu-box">
          <ul>
            <li onClick={() => navigate('/userprofile')}>
              <span className="dropdown-icon">👤</span> Profil personnel
            </li>
            <li onClick={handleLogout} disabled={loadingLogout}>
              <span className="dropdown-icon">🚪</span>
              {loadingLogout ? 'Déconnexion...' : 'Déconnexion'}
            </li>
          </ul>
        </div>
      )}
    </>
  );
}

export default Navbar;
