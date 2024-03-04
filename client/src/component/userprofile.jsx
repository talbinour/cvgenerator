import React , { useState, useEffect }  from 'react';
import avatar from '../assets/profile.png';
import { BsPlusCircle } from 'react-icons/bs';
import './userprofile.css';
import axios from 'axios'; 

const UserProfile = () => {
    const [user, setUser] = useState(null);
  
    useEffect(() => {
      const token = localStorage.getItem('token');
  
      if (token) {
        axios.get('http://localhost:8080/current-username', { withCredentials: true })
          .then(response => {
            setUser(response.data.user);
          })
          .catch(error => {
            console.error('Erreur lors de la récupération des informations utilisateur :', error);
          });
      }
    }, []);
 
     return (
         <div className="container mx-auto">
             <div className="flex justify-center items-center h-screen">
                 <div className="glass-container w-70">
                     <div className="profile flex items-center justify-center gap-4">
                         <img src={avatar} className="profile_img" alt="avatar" />
                         <button className="edit-image-button">
                             <BsPlusCircle size={24} color="#1f4172" />
                         </button>
                     </div>
                    <div className="textbox flex flex-wrap justify-center gap-4"> 
                        <input className="input" type="text" value={user ? user.nom : ''} placeholder='Nom' />                        
                        <input className="input" type="text" value={user ? user.prenom : ''}placeholder='Prénom' />
                        <input className="input" type="text"  value={user ? user.Nbphone : ''}placeholder='Num téléphone' />
                        <input className="input" type="text" value={user ? user.email : ''} placeholder='Email' />
                        <input className="input full-width" value={user ? user.date_naissance : ''} type="text" placeholder='date de naissance ' />
                        <button className="btn" type='submit'>Mettre à jour</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserProfile;