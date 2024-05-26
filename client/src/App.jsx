import './App.css';
import React from 'react';
import Login from './Login';
import SignUp from './SignUp';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from "./component/Navbar";
import Footer from './component/Footer'; // Importez le composant Footer
import Home from "./component/Home";
import About from "./component/About";
import Services from "./component/Services";
import Profile from "./component/Profile";
import Blog from "./component/Blog";
import DashboardPage from './DashboardPage/DashboardPage';
import ResumesPage from './DashboardPage/ResumesPage';
import Testimonials from './component/Testimonials';
import JobOffersPage from './DashboardPage/JobOffersPage';
import ApplicationsPage from './DashboardPage/ApplicationsPage';
import DashboardContent from './DashboardPage/DashboardContent';
import Modal from './DashboardPage/Modal';
import Contact from './component/contact';
import Skills from "./DashboardPage/Skills";
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
import Model7 from "./Cv/model7";
import ModelUser from "./Cv/model7-user";
import ModelUser6 from "./Cv/model6-user";
import Model8 from "./Cv/model8";
import Edit from "./Cv/edit";
import Edit6 from "./Cv/edit6";
import Edit5 from "./Cv/editmodel5";
import ModeleEdit from "./Cv/ModeleEdit";
import Chatbot from "./chatbot/chatbot";
import Chatbot2 from "./chatbot/chatbot2";
import CVModel6 from "./CvModelChat/CVModel6";
import CVModel from "./CvModelChat/CVModel";
import CVModel5 from "./CvModelChat/CVModel5";
import CVModel3 from "./CvModelChat/CVModel3";
import CVModel2 from "./CvModelChat/CVModel2";
import CVModel7 from "./CvModelChat/CVModel7";
import NewQuestion from "./CvModelChat/NewQuestion";
import Speech from "./chatbot/Speech";
import CVSelection from "./CVSelectionPage";
import TestUpdate from './TestUpdate';
import StylePalette from './Style/StylePalette';
import Sitemap from './component/sitemap'; // Assurez-vous que le chemin d'importation est correct
import CookiePolicy from './component/CookiePolicy'; // Assurez-vous que le chemin d'importation est correct
import EditCv from "./Cv/editCv.jsx"; 
import Edit6Cv from "./Cv/edit6Cv.jsx"; 
import CookieConsentBanner from './component/CookieConsentBanner';
function App() {
  return (
    <>
      <Router>
        <Navbar currentUser={null} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/skills' element={<Skills />} />
          <Route path='/login' element={<Login />} />
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />}  />
          <Route path='/cvselection' element={<CVSelection />}  />
          <Route path='/test' element={<TestUpdate />}  />
          <Route path='/skills' element={<Skills />}  />
          <Route path='/Testimonials' element={<Testimonials />}  />
          <Route path='/login' element={<Login />}  />
          <Route path='/services' element={<Services />} />
          <Route path='/Signup' element={<SignUp />} /> 
          <Route path='/Blog' element={<Blog />} /> 
          <Route path="/dashboard" element={<DashboardPage />} /> 
          <Route path="/dashboard/:cvId" element={<DashboardContent />} />          <Route path="/resumes" element={<ResumesPage />} />           
          <Route path="/JobOffers" element={<JobOffersPage />} /> 
          <Route path="/contact" element={<Contact />} />                     
          <Route path="/Applications" element={<ApplicationsPage />} />           
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
          <Route path='/Model7' element={<Model7/>} />
          <Route path='/Modal' element={<Modal/>} />
          <Route path='/model7-user/:userId/:cvId/:id' element={<ModelUser/>} />
          <Route path='/model6-user/:userId/:cvId/:id' element={<ModelUser6/>} />
          <Route path='/Model8' element={<Model8/>} />
          <Route path='/edit-cv' element={<Edit/>} />
          <Route path='/editcv/:userId/:cvId/:id' element={<EditCv/>} />
          <Route path='/edit6cv/:userId/:cvId/:id' element={<Edit6Cv/>} />
          <Route path='/edit6-cv' element={<Edit6/>} />
          <Route path='/edit5-cv' element={<Edit5/>} />
          <Route path='/ModeleEdit' element={<ModeleEdit/>} />
          <Route path='/chatbot' element={<Chatbot />} />
          <Route path='/Speech' element={<Speech />} />
          <Route path='/chatbot2/:conversation_id' element={<Chatbot2 />} />
          <Route path='/CVModel6' element={<CVModel6 />} />
          <Route path='/CVModel' element={<CVModel />} />
          <Route path='/CVModel5' element={<CVModel5 />} />
          <Route path='/CVModel2' element={<CVModel2 />} />
          <Route path='/CVModel3' element={<CVModel3 />} />
          <Route path='/CVModel7' element={<CVModel7 />} />
          <Route path='/StylePalette' element={<StylePalette />} />
          <Route path="/sitemap" element={<Sitemap />} />
          <Route path="/cookiePolicy" element={<CookiePolicy />} />
          <Route path='/NewQuestion' element={<NewQuestion />} />
          <Route path="/change-password/:email/:verificationCode" element={<NewPassword />} />
          {/* Add routes for Login and SignUp if needed */}
          {/* <Route path='/login' element={<Login />} exact />
              <Route path='/signup' element={<SignUp />} exact /> */}
        </Routes>
        <CookieConsentBanner />
        <Footer /> {/* Ajoutez le composant Footer ici */}
      </Router>
    </>
  );
}

export default App;
