import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './mix.css';

const VerificationPage = () => {
  const [verificationCode, setVerificationCode] = useState("");
  const navigate = useNavigate();

  const submitVerificationCode = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/verify-reset-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ verificationCode })
      });

      const data = await res.json();

      if (data.status === 201) {
        // Verification successful, navigate to the next page
        navigate("/ForgotPassword");
      } else {
        // Verification failed, show error toast
        toast.error("Invalid verification code!", {
          position: "top-center"
        });
      }
    } catch (error) {
      console.error('Error verifying verification code:', error);
      // Show error toast for server error
      toast.error("An error occurred while verifying the verification code.", {
        position: "top-center"
      });
    }
  }

  return (
    <div className="form_data">
      <div className="form_heading">
        <h2 style={{ textAlign: 'center' }}>Enter Verification Code</h2>
      </div>

      <form>
        <div className="form_input">
          <label htmlFor="verificationCode">Verification Code:</label>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            name="verificationCode"
            id="verificationCode"
            placeholder="Enter Verification Code"
          />
        </div>

        <button className='btn' onClick={submitVerificationCode}>
          Verify Code
        </button>
      </form>
      <ToastContainer />
    </div>
  );
}

export default VerificationPage;
