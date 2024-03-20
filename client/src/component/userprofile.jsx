import React, { useState, useEffect, useRef } from 'react';
import defaultAvatar from '../assets/profile.png'; // Importer l'image par défaut
import { BsPlusCircle } from 'react-icons/bs';
import axios from 'axios';

const UserProfile = () => {
  const [userId, setUserId] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [Nbphone, setNbphone] = useState('');
  const [email, setEmail] = useState('');
  const [pays, setPays] = useState('');
  const [dateNaissance, setDateNaissance] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [userPhoto, setUserPhoto] = useState(null); // État pour stocker l'image de l'utilisateur
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
          setPays(userData.pays);

          // Vérifier si l'utilisateur a une photo
          if (userData.photo) {
            setUserPhoto(userData.photo);
          }
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
        pays: pays,
      };

      if (selectedImage) {
        const formData = new FormData();
        formData.append('image', selectedImage);

        await axios.post(`http://localhost:8080/updateUserPhoto/${userId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Mettre à jour l'image affichée après le téléchargement
        setUserPhoto(URL.createObjectURL(selectedImage));
      }

      const response = await axios.put(`http://localhost:8080/updateUser/${userId}`, updatedUserData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNom(response.data.user.nom);
      setPrenom(response.data.user.prenom);

      inputRef.current.value = '';

      setUpdateSuccess(true);

      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error updating user information:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-center items-center h-screen">
        <div className="glass-container w-70">
          <div>
            <div className="profile_img_container">
              <img src={userPhoto || defaultAvatar} className="profile_img" alt="avatar" />
              <button className="edit-image-button" onClick={() => inputRef.current.click()}>
                <BsPlusCircle size={24} color="#1f4172" type="button" />
              </button>
              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg, image/jpg, image/png"
                style={{ display: 'none' }}
                onChange={handleImageChange}
              />
            </div>

            <div className="profile flex items-center justify-center gap-4">
              <h2>{`${prenom} ${nom}`}</h2>
              <h5>{`${email}`}</h5>
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
                Pays :
              </label>
              <input
                id="pays"
                className="input"
                type="text"
                value={pays}
                placeholder="Pays"
                onChange={(e) => setPays(e.target.value)}
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
