import React, { useState, useEffect, useRef } from 'react';
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
  const [pays, setpays] = useState('');
  
  const [dateNaissance, setDateNaissance] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const inputRef = useRef(null); // Référence pour le champ de fichier

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      axios
        .get('http://localhost:8080/current-username', { withCredentials: true })
        .then((response) => {
          const userData = response.data.user;
          const userId = userData.id || userData.user_id;

          setUserId(userId);
          setNom(userData.nom);
          setPrenom(userData.prenom);
          setNbphone(userData.Nbphone);
          setEmail(userData.email);
          setDateNaissance(userData.date_naissance);
          setpays(userData.pays);
        })
        .catch((error) => {
          console.error('Erreur lors de la récupération des informations utilisateur:', error);
        });
    }
  }, []);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
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
        pays: pays,
      };

      const response = await axios.put(`http://localhost:8080/updateUser/${userId}`, updatedUserData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Mettez à jour l'état local avec les données mises à jour si nécessaire
      setNom(response.data.user.nom);
      setPrenom(response.data.user.prenom);

      // Réinitialiser le champ de fichier
      inputRef.current.value = '';

      // Afficher le message de succès
      setUpdateSuccess(true);

      // Réinitialiser le message de succès après quelques secondes
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error updating user information:', error);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-center items-center h-screen">
        <div className="glass-container w-70">
          <div>
          <div className="profile_img_container">
            <img src={avatar} className="profile_img" alt="avatar" />
          </div>

          <div className="profile flex items-center justify-center gap-4">
            <h2>{`${prenom} ${nom}`}</h2>
            <h5>{`${email}`}</h5>
            <button className="edit-image-button" onClick={() => inputRef.current.click()}>
              <BsPlusCircle size={24} color="#1f4172" type="button" />
            </button>
            {/* Champ de fichier caché */}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files[0];
                setSelectedImage(file);
              }}
            />
          </div>
          </div>
          <div>
          <div className="textbox flex flex-wrap justify-center gap-4">
            <label htmlFor="nom" className="label">
              Nom :
            </label>
            <input
              id="nom"
              className="input"
              type="text"
              value={nom}
              placeholder="Nom"
              onChange={(e) => setNom(e.target.value)}
            />
          </div>
          <div className="textbox flex flex-wrap justify-center gap-4">
            <label htmlFor="prenom" className="label">
              Prénom :
            </label>
            <input
              id="prenom"
              className="input"
              type="text"
              value={prenom}
              placeholder="Prénom"
              onChange={(e) => setPrenom(e.target.value)}
            />
          </div>
          <div className="textbox flex flex-wrap justify-center gap-4">
            <label htmlFor="Nbphone" className="label">
              Numéro de téléphone :
            </label>
            <input
              id="Nbphone"
              className="input"
              type="text"
              value={Nbphone}
              placeholder="Num téléphone"
              onChange={(e) => setNbphone(e.target.value)}
            />
          </div>
          <div className="textbox flex flex-wrap justify-center gap-4">
            <label htmlFor="pays" className="label">
              pays :
            </label>
            <input
              id="Nbphone"
              className="input"
              type="text"
              value={pays}
              placeholder="pays"
              onChange={(e) => setpays(e.target.value)}
            />
          </div>
          <div className="textbox flex flex-wrap justify-center gap-4">
            <label htmlFor="dateNaissance" className="label">
              Date de naissance :
            </label>
            <input
              id="dateNaissance"
              className="input full-width"
              value={dateNaissance}
              type="text"
              placeholder="Date de naissance"
              onChange={(e) => setDateNaissance(e.target.value)}
            />
          </div>

          <button className="btn" type="button" onClick={handleUpdate}>
            Mettre à jour
          </button>
          {updateSuccess && <div className="alert success">Mise à jour réussie !</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
