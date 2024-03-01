import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import logoImage from '../assets/cevor-high-resolution-logo-transparent (1).png';
import Profile from "./Profile";
import axios from 'axios'; // Importer axios pour effectuer des requêtes HTTP
import './navbar.css';

const Navbar = () => {
  const [mobile, setMobile] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false); // État pour gérer la visibilité de la liste de profil

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get('http://localhost:8080/current-username', { withCredentials: true });
        setCurrentUser(response.data.username);
      } catch (error) {
        console.error('Erreur lors de la récupération du nom d utilisateur :', error);
      }
    };

    fetchCurrentUser();
  }, []);

  return (
    <>
      <nav className='navbar'>
        <img src={logoImage} alt="Logo-png" className='logo-png' style={{  position: "sticky", left: '2',width: '5%', height: '50px' }} />
        

        <ul className={mobile ? "nav-links-mobile" : "nav-links"} onClick={() => setMobile(false)}>
          <Link to='/' className='home'>
            <li>accuiel </li>
          </Link>
          <Link to='/about' className='about'>
            <li>à propos</li>
          </Link>
          <Link to='/services' className='services'>
            <li>Services</li>
          </Link>
          <Link to='/skills' className='skills'>
            <li>Test </li>
          </Link>
          <Link to='/login' className='login'>
            <li>Connexion </li>
          </Link>
          {currentUser && (
            <li onClick={() => setShowProfileMenu(!showProfileMenu)}>{currentUser}</li> 
          )}
        </ul>
        <button className='mobile-menu-icon' onClick={() => setMobile(!mobile)}>
          {mobile ? <ImCross /> : <FaBars />}
        </button>
      </nav>

      {/* Afficher la liste de profil et de déconnexion uniquement si showProfileMenu est true */}
      {showProfileMenu && <Profile />}
    </>
  );
}

export default Navbar;