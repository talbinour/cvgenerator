import React, { useState, useEffect, useRef } from 'react';
import { BsPlusCircle } from 'react-icons/bs';
import axios from 'axios';
import './userprofile.css';

const UserProfile = () => {
  const [userId, setUserId] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [Nbphone, setNbphone] = useState('');
  const [email, setEmail] = useState('');
  const [pays, setPays] = useState('');
  const [dateNaissance, setDateNaissance] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [userPhoto, setUserPhoto] = useState(null); 
  const [selectedImage, setSelectedImage] = useState(null); 
  const inputRef = useRef(null); 
  
 
// Modifier la fonction useEffect pour récupérer l'URL de l'image de profil de l'utilisateur
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

              // Récupérer l'URL de l'image de profil de l'utilisateur
              setUserPhoto(userData.photo);
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

      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('nom', nom);
      formData.append('prenom', prenom);
      formData.append('Nbphone', Nbphone);
      formData.append('email', email);
      formData.append('date_naissance', dateNaissance);
      formData.append('pays', pays);
      if (selectedImage) {
        formData.append('photo', selectedImage);
      }

      const response = await axios.put(`http://localhost:8080/updateUser/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      setUserPhoto(response.data.user.photo);

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
    console.log('New user photo:', userPhoto);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setUserPhoto(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-center items-center h-screen">
        <div className="glass-container w-70">
          <div className="profile-container">
            <div className="image-container">
            {userPhoto && (
              <img src={`http://localhost:8080/${userPhoto}`} className="profile_img" alt="avatar" />
            )}
              <button className="edit-image-button" onClick={() => inputRef.current.click()}>
                <BsPlusCircle size={24} color="#1f4172" type="button" />
              </button>
              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg, image/jpg, image/png"
                style={{ display: 'none' }}
                onChange={handleImageChange}
                name="profileImage" 
              />
            </div>
            <div className="profile-details">
              <div className="profile-info">
                <h2>{`${prenom} ${nom}`}</h2>
                <div className="email">{`${email}`}</div>
              </div>
            </div>
          </div>
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
       {/* Affichage de l'image de profil dans un conteneur distinct */}
       <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px' }}>
        <h2>Profile Photo</h2>
        {userPhoto ? (
          <img src={userPhoto} alt="Profile" style={{ maxWidth: '300px' }} />
        ) : (
          <p>No profile photo available</p>
        )}
      </div>
    </div>
    
  );
};

export default UserProfile;
