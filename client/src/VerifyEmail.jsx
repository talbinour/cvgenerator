// Dans votre composant React pour la vérification par e-mail
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const VerifyEmailPage = () => {
  const { emailToken } = useParams();
  const [verificationMessage, setVerificationMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/verify-email/${emailToken}`);
        setVerificationMessage(response.data.message);
      } catch (error) {
        setVerificationMessage('Email verification failed');
      }
    };

    verifyEmail();
  }, [emailToken]);

  return (
    <div>
      <h2>Email Verification</h2>
      <p>{verificationMessage}</p>
    </div>
  );
};

export default VerifyEmailPage;
