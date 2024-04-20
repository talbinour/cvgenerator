import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TestUpdate = () => {
  const [formData, setFormData] = useState({ rahma: null });

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      axios
        .get('http://localhost:8080/current-username', { withCredentials: true })
        .then((response) => {
          const userData = response.data.user;
          // Utilisez les données de userData selon vos besoins
          if (userData.rahma) {
            setFormData({ rahma: userData.rahma });
          }
        })
        .catch((error) => {
          console.error('Erreur lors de la récupération des informations utilisateur:', error);
        });
    }
  }, []);

  const handleRahmaChange = (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) {
      return;
    }
  
    const reader = new FileReader();
  
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setFormData({
          ...formData,
          rahma: reader.result
        });
      }
    };
  
    reader.readAsDataURL(file);
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token is missing or undefined. Make sure it is set correctly.');
        return;
      }

      const updatedUserData = {
        rahma: formData.rahma
      };

      await axios.put('http://localhost:8080/updateUser', updatedUserData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Gérer la mise à jour réussie de l'utilisateur si nécessaire

    } catch (error) {
      console.error('Error updating user information:', error);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-center items-center h-screen">
        <div className="glass-container w-70">
          <label className="cursor-pointer" htmlFor="rahma-input">
            Rahma:
            {formData.rahma ? (
              <img src={formData.rahma} alt="Rahma" style={{ maxWidth: '100%', maxHeight: '200px' }} />
            ) : (
              <div className="text-gray-500">No Image</div>
            )}
            <input id="rahma-input" type="file" accept='image/*' onChange={handleRahmaChange} />
          </label>
          <button onClick={handleUpdate}>Update Rahma</button>
        </div>
      </div>
    </div>
  );
};

export default TestUpdate;
