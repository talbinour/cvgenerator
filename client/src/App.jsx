import './App.css';
import React from 'react';
// Removed the commented-out import
import Login from './Login'; // Make sure the path is correct
import SignUp from './SignUp'; // Make sure the path is correct
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from "./component/Navbar"; // Make sure "component" spelling is correct in your directory structure
import Home from "./component/Home";
import About from "./component/About";
import Skills from "./component/Skills";
import Services from "./component/Services";
import DashboardPage from './DashboardPage';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


function App() {
  return (
    <>
      <Router>
        <Navbar />

        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />}  />
          <Route path='/skills' element={<Skills />}  />
          <Route path='/login' element={<Login />}  />
          <Route path='/services' element={<Services />} />
          <Route path='/Signup' element={<SignUp />} /> 
          <Route path="/dashboard" element={<DashboardPage />} />
          {/* Add routes for Login and SignUp if needed */}
          {/* <Route path='/login' element={<Login />} exact />
              <Route path='/signup' element={<SignUp />} exact /> */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
