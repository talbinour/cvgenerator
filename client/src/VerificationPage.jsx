import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './mix.css';

const VerificationPage = () => {
  const [verificationCode, setVerificationCode] = useState("");
  const navigate = useNavigate();
  const { email } = useParams();

  const submitVerificationCode = async (e) => {
    e.preventDefault();

    try {
      // Make the POST request using axios
      const response = await axios.post(
        "http://localhost:8080/verify-reset-code",
        { verificationCode, email }, // Include email in the request
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;

      if (data.status === 201) {
        const token = verificationCode;
        console.log('email:', email);
        console.log('token:', token);
        console.log('email:', email);
        console.log('verificationCode:', verificationCode);
        navigate(`/change-password/${email}/${verificationCode}`);

      } else {
        // Verification failed, show error toast
        toast.error("Invalid verification code!", {
          position: "top-center",
        });
      }
    } catch (error) {
      console.error('Error verifying verification code:', error);
      // Show error toast for server error
      toast.error("An error occurred while verifying the verification code.", {
        position: "top-center",
      });
    }
  };

  return (
    <div className="form_data">
    <div className="glass-container w-70">

      <div className="form_heading">
        <h2 style={{ textAlign: 'center' }}>Saisir le Code de Validation</h2>
        <p style={{ textAlign: 'initial' }}>veuillez le saisir ci-dessous . Assurez-vous de le copier exactement comme il apparaît dans l&apos;e-mail, sans espaces supplémentaires.</p>
      </div>

      <form>
        <div className="form_input">
          <label htmlFor="verificationCode">Code de Verification:</label>
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
          Verifier 
        </button>
      </form>
      <ToastContainer />
    </div>
    </div>
  );
}

export default VerificationPage;
