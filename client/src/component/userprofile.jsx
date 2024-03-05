import React, { useState, useEffect } from 'react';
import avatar from '../assets/profile.png';
import { BsPlusCircle } from 'react-icons/bs';
import './userprofile.css';
import axios from 'axios';

const UserProfile = () => {
  const [userId, setUserId] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [Nbphone, setNbphone] = useState('');
  const [email, setEmail] = useState('');
  const [dateNaissance, setDateNaissance] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
  
    if (token) {
      axios
        .get('http://localhost:8080/current-username', { withCredentials: true })
        .then((response) => {
          const userData = response.data.user;
          console.log('User Data:', userData);
  
          // Assurez-vous que l'ID de l'utilisateur est correctement extrait
          const userId = userData.id || userData.user_id;
  
          setUserId(userId);
          setNom(userData.nom);
          setPrenom(userData.prenom);
          setNbphone(userData.Nbphone);
          setEmail(userData.email);
          setDateNaissance(userData.date_naissance);
        })
        .catch((error) => {
          console.error('Erreur lors de la récupération des informations utilisateur:', error);
        });
    }
  }, []);
  useEffect(() => {
    const token = localStorage.getItem('token');
  
    if (token) {
      axios
        .get('http://localhost:8080/current-username', { withCredentials: true })
        .then((response) => {
          const userData = response.data.user;
          console.log('User Data:', userData);
  
          // Assurez-vous que l'ID de l'utilisateur est correctement extrait
          const userId = userData.id || userData.user_id;
  
          setUserId(userId);
          setNom(userData.nom);
          setPrenom(userData.prenom);
          setNbphone(userData.Nbphone);
          setEmail(userData.email);
          setDateNaissance(userData.date_naissance);
        })
        .catch((error) => {
          console.error('Erreur lors de la récupération des informations utilisateur:', error);
        });
    }
  }, []);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };
  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('UserID:', userId);
      console.log('Token:', token);
      if (!userId || !token) {
        console.error('User ID or token is missing or undefined. Make sure they are set correctly.');
        return;
      }

      const updatedUserData = {
        nom,
        prenom,
        Nbphone,
        email,
        date_naissance: dateNaissance,
        user_id: userId,
        profileImage: selectedImage,
      };

      const response = await axios.put(`http://localhost:8080/updateUser/${userId}`, updatedUserData,
       {headers: {
          Authorization: `Bearer ${token}`,
          },
       });

       console.log('Response Data:', response.data); 
      // Mettez à jour l'état local avec les données mises à jour si nécessaire
      setNom(response.data.user.nom);
      setPrenom(response.data.user.prenom);
      // You might want to update the local state with the updated data
    } catch (error) {
      console.error('Error updating user information:', error);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-center items-center h-screen">
        <div className="glass-container w-70">
          <div className="profile flex items-center justify-center gap-4">
            <img src={avatar} className="profile_img" alt="avatar" />
            <button className="edit-image-button">
              <BsPlusCircle size={24} color="#1f4172" type="button" onClick={handleUpdate}/>
            </button>
            <input type="file" accept="image/*" onChange={handleImageChange} />

          </div>
          <div className="textbox flex flex-wrap justify-center gap-4">
            <h2>{`${prenom} ${nom}`}</h2>
            <input
              className="input"
              type="text"
              value={nom}
              placeholder="Nom"
              onChange={(e) => setNom(e.target.value)}
            />
            <input
              className="input"
              type="text"
              value={prenom}
              placeholder="Prénom"
              onChange={(e) => setPrenom(e.target.value)}
            />
            <input
              className="input"
              type="text"
              value={Nbphone}
              placeholder="Num téléphone"
              onChange={(e) => setNbphone(e.target.value)}
            />
            <input
              className="input"
              type="text"
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="input full-width"
              value={dateNaissance}
              type="text"
              placeholder="Date de naissance"
              onChange={(e) => setDateNaissance(e.target.value)}
            />
            <button className="btn" type="button" onClick={handleUpdate}>
              Mettre à jour
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
