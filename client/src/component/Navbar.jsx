import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import logoImage from '../assets/cevor-high-resolution-logo-transparent (1).png';
import defaultAvatar from '../assets/user.png'; // Importer l'image par défaut
import axios from 'axios';
import './navbar.css';

const Navbar = () => {
  const [mobile, setMobile] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [loadingLogout, setLoadingLogout] = useState(false);
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const profileMenuRef = useRef(null); // Référence pour le menu de profil

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false); // Cacher le menu de profil si on clique à l'extérieur
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
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
      setShowProfileMenu(false); // Cacher le menu de profil après la déconnexion
    }
  };

  return (
    <>
      <nav className='navbar'>
        <img src={logoImage} alt="Logo-png" className='logo-png' style={{ width: '5%', height: '50px' }} />

        <ul className={mobile ? "nav-links-mobile" : "nav-links"} onClick={() => setMobile(false)}>
          <li>
            <Link to='/' className='home'>
              Accueil
            </Link>
          </li>
          <li>
            <Link to='/about' className='about'>
              À propos
            </Link>
          </li>
          <li>
            <Link to='/services' className='services'>
              Services
            </Link>
          </li>
          {currentUser && (
            <li>
              <Link to='/dashboard' className='dashboard'>
                Tableau de bord
              </Link>
            </li>
          )}
          {currentUser && (
            <li>
              <div className="profile-menu" ref={profileMenuRef}>
                <img src={defaultAvatar} alt="Avatar" className="avatar" onClick={() => setShowProfileMenu(!showProfileMenu)} />
                {showProfileMenu && (
                  <div className="profile-menu-box">
                    <ul>
                      <li onClick={() => { navigate('/userprofile'); setShowProfileMenu(false); }}>
                        Profil personnel
                      </li>
                      <li onClick={handleLogout} disabled={loadingLogout}>
                        {loadingLogout ? 'Déconnexion...' : 'Déconnexion'}
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </li>
          )}
          {!currentUser && (
            <li>
              <Link to='/login'>
                Connexion
              </Link>
            </li>
          )}
        </ul>
        <button className='mobile-menu-icon' onClick={() => setMobile(!mobile)}>
          {mobile ? <ImCross /> : <FaBars />}
        </button>
      </nav>
    </>
  );
}

export default Navbar;
