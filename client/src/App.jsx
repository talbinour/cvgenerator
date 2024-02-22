import './App.css';
import React from 'react';// Removed the commented-out import
import Login from './Login'; // Make sure the path is correct
import SignUp from './SignUp'; // Make sure the path is correct
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from "./component/Navbar"; // Make sure "component" spelling is correct in your directory structure
import Home from "./component/Home";
import About from "./component/About";
import Skills from "./component/Skills";
import Services from "./component/Services";
import Profile from "./component/Profile";
import DashboardPage from './DashboardPage';
import ForgotPassword from './ForgotPassword';
import PasswordReset from './PasswordReset';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VerifyEmail from './VerifyEmail'; 
import VerificationPage from './VerificationPage';
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
          <Route path="/ForgotPassword" element={<ForgotPassword />} />
          <Route path="/password-reset" element={<PasswordReset />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/VerificationPage" element={<VerificationPage />} />

          <Route path="/VerifyEmail" element={<VerifyEmail />} />
          {/* Add routes for Login and SignUp if needed */}
          {/* <Route path='/login' element={<Login />} exact />
              <Route path='/signup' element={<SignUp />} exact /> */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
