// Dans le fichier './components/PhoneNumberValidation.jsx' par exemple
import React, { useState } from 'react';

const PhoneNumberValidation = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [valid, setValid] = useState(true);

  const handleChange = (event) => {
    const input = event.target.value;
    setPhoneNumber(input);
    setValid(validatePhoneNumber(input));
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phoneNumberPattern = /^\d{10}$/; // Valide un numéro de téléphone à 10 chiffres

    return phoneNumberPattern.test(phoneNumber);
  };

  return (
    <div>
      <label>
        Numéro de téléphone :
        <input
          type="text"
          value={phoneNumber}
          onChange={handleChange}
        />
      </label>
      {!valid && <p>Veuillez entrer un numéro de téléphone valide à 10 chiffres.</p>}
    </div>
  );
};

export default PhoneNumberValidation;
