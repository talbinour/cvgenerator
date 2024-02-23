import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './VerificationPage.css';

const VerificationPage = () => {
  const [verificationCode, setVerificationCode] = useState("");
  const navigate = useNavigate();

  const submitVerificationCode = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/verifycode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ verificationCode })
      });

      const data = await res.json();

      if (data.status === 201) {
        navigate("/ForgotPassword");
      } else {
        toast.error("Invalid verification code!", {
          position: "top-center"
        });
      }
    } catch (error) {
      console.error('Error verifying verification code:', error);
      toast.error("An error occurred while verifying the verification code.", {
        position: "top-center"
      });
    }
  }

  return (
    <div className="verification_page">
      <div className="verification_heading">
        <h2 style={{ textAlign: 'center' }}>Enter Verification Code</h2>
      </div>

      <form>
        <div className="verification_input">
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
