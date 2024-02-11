import React from "react"
import logoImage from '../assets/cevor-high-resolution-logo-transparent.png';

const Home = () => {
  return (
    <>
      <section className='hero'>
        <h3>Welcome To Home Page</h3>
        <img src={logoImage} alt="Logo" className='logo' style={{ width: '30%', height: '30%' }} />
      </section>
    </>
  )
}
export default Home