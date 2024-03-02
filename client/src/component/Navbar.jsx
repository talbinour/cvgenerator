import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import logoImage from '../assets/cevor-high-resolution-logo-transparent (1).png';
import Profile from "./Profile";
import axios from 'axios';
import './navbar.css';

const Navbar = () => {
  const [mobile, setMobile] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [loadingLogout, setLoadingLogout] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get('http://localhost:8080/current-username', { withCredentials: true });
        setCurrentUser(response.data.username);
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchCurrentUser();
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
            <li>Test </li>
          </Link>
          {currentUser && (
            <li onClick={() => setShowProfileMenu(!showProfileMenu)}>
              {currentUser}
              {showProfileMenu && <Profile />}
            </li>
          )}
          <li>
            {currentUser ? (
              <button onClick={handleLogout} disabled={loadingLogout}>
                {loadingLogout ? 'Déconnexion...' : 'Déconnexion'}
              </button>
            ) : (
              <Link to='/login'>
                <button>Connexion</button>
              </Link>
            )}
          </li>
        </ul>
        <button className='mobile-menu-icon' onClick={() => setMobile(!mobile)}>
          {mobile ? <ImCross /> : <FaBars />}
        </button>
      </nav>
    </>
  );
}

export default Navbar;
