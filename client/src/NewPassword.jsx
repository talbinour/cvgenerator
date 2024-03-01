import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './mix.css';

const NewPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const params = useParams();
  const { email, verificationCode } = params; // Destructure email directly
  const navigate = useNavigate();

  useEffect(() => {
    console.log('email:', email);
    console.log('verificationCode:', verificationCode);
  
    // Check if email and verificationCode are undefined or not
    if (!email || !verificationCode) {
      // Handle the case when email or verificationCode is undefined
      console.error('Invalid email or verificationCode');
      // You might want to navigate to an error page or handle it appropriately
    }
  }, [email, verificationCode]);
  
  const handleChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      if (!email || !verificationCode || !newPassword) {
        console.error('Invalid email, verificationCode, or newPassword');
        return;
      }
  
      // Make the POST request using axios
      await axios.post(
        `http://localhost:8080/change-password/${email}/${verificationCode}`,
        { newPassword },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      // Example of navigating after a successful password change
      navigate('/login');
    } catch (error) {
      console.error('Error changing password:', error);
      // Show error toast for server error
      toast.error('An error occurred while changing the password.', {
        position: 'top-center',
      });
    }
  };
  

  return (
    <>
      <div className="form_data">
        <div className="form_heading">
          <h2 style={{ textAlign: 'center' }}></h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form_input">
            <label htmlFor="newPassword">New Password:</label>
            <input
              type="password"
              value={newPassword}
              onChange={handleChange}
              name="newPassword"
              id="newPassword"
              placeholder="Enter New Password"
            />
          </div>

          <button type="submit" className="btn">
            Change Password
          </button>
        </form>
        <ToastContainer />
      </div>
    </>
  );
};

export default NewPassword;
