import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import logoImage from '../assets/cevor-high-resolution-logo-transparent (1).png';
import Profile from "./Profile";
import './navbar.css';


const Navbar = () => {
  const [Mobile, setMobile] = useState(false);

  return (
    <>
      <nav className='navbar'>
        <img src={logoImage} alt="Logo-png" className='logo-png' style={{  position: "sticky", left: '2',width: '5%', height: '50px' }} />
        

        <ul className={Mobile ? "nav-links-mobile" : "nav-links"} onClick={() => setMobile(false)}>
          <Link to='/' className='home'>
            <li>accuiel </li>
          </Link>
          <Link to='/about' className='about'>
            <li>About</li>
          </Link>
          <Link to='/services' className='services'>
            <li>Services</li>
          </Link>
          <Link to='/skills' className='skills'>
            <li>Test </li>
          </Link>
          <Link to='/login' className='login'>
            <li>se_connecter</li>
          </Link>
          <Profile /> {/* Ajouter le composant Profile */}
        </ul>
        <button className='mobile-menu-icon' onClick={() => setMobile(!Mobile)}>
          {Mobile ? <ImCross /> : <FaBars />}
        </button>
      </nav>
    </>
  );
}

export default Navbar;
