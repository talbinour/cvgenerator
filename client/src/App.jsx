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
import NewPassword from './NewPassword';
import PasswordReset from './PasswordReset';
import Admin from "./component/Admin";
import Userprofile from "./component/userprofile";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VerificationPage from './VerificationPage';
import Model from "./Cv/model";
import Model2 from "./Cv/model2";
import Model3 from "./Cv/model3";
import Model4 from "./Cv/model4";
import Model5 from "./Cv/model5";
import Model6 from "./Cv/model6";
function App() {
  return (
    <>
      <Router>
      <Navbar currentUser={null} />

        <Routes>
        <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />}  />
          <Route path='/skills' element={<Skills />}  />
          <Route path='/login' element={<Login />}  />
          <Route path='/services' element={<Services />} />
          <Route path='/Signup' element={<SignUp />} /> 
          <Route path="/dashboard" element={<DashboardPage />} />           
          <Route path='/userprofile' element={<Userprofile/>} />
          <Route path="/password-reset" element={<PasswordReset />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/VerificationPage/:email" element={<VerificationPage />} />
          <Route path='/Admin' element={<Admin />} />
          <Route path='/Model' element={<Model />} />
          <Route path='/Model2' element={<Model2 />} />
          <Route path='/Model3' element={<Model3 />} />
          <Route path='/Model4' element={<Model4 />} />
          <Route path='/Model5' element={<Model5 />} />
          <Route path='/Model6' element={<Model6 />} />
          <Route path="/change-password/:email/:verificationCode" element={<NewPassword />} />
          {/* Add routes for Login and SignUp if needed */}
          {/* <Route path='/login' element={<Login />} exact />
              <Route path='/signup' element={<SignUp />} exact /> */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
