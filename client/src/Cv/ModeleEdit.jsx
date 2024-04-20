import React, { useState, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.css';
import avatar from '../assets/cvprofile.jpeg';
import styles from './model7.module.css'; 
import ModeleEdit from './ModeleEdit'; 
function ParentComponent() {
  // État local pour le modèle de CV
  const [cvModel, setCvModel] = useState({
    name: 'John Doe',
    jobTitle: 'Web Developer',
    phone: '0900 786 01',
    email: 'emmi@gmail.com',
    website: 'mywebsite.com',
    linkedin: 'www.linkedin.com',
    address: '56th street, california'
  });

  // Fonction pour charger le modèle de CV existant
  const loadModel = () => {
    // Code pour charger le modèle de CV existant depuis votre source de données (par exemple, un fichier JSON, une API, etc.)
    return {
      name: 'John Doe',
      jobTitle: 'Web Developer',
      // Autres champs de modèle de CV...
    };
  };

  useEffect(() => {
    // Charger le modèle de CV au chargement du composant
    setCvModel(loadModel());
  }, []);

  // Fonction pour gérer la sauvegarde du modèle de CV modifié
  const handleSave = () => {
    // Création d'un objet FormData pour envoyer les données
    const formData = new FormData();
    formData.append('name', cvModel.name);
    formData.append('jobTitle', cvModel.jobTitle);
    // Ajoutez d'autres champs au besoin

    // Envoyer les données modifiées à l'API pour sauvegarde
    fetch('http://localhost:8080/cv', {
      method: 'PUT', // ou 'POST' si c'est une nouvelle sauvegarde
      body: formData,
    })
    .then(response => response.json())
    .then(data => {
      console.log('CV sauvegardé avec succès:', data);
      // Mettre à jour l'état local avec les données renvoyées par l'API si nécessaire
    })
    .catch(error => {
      console.error('Erreur lors de la sauvegarde du CV:', error);
    });
  };

  // Fonction pour gérer les changements dans le formulaire de modification
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCvModel(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Fonction pour gérer l'édition du modèle de CV
  const handleEdit = (editedModel) => {
    // Mettre à jour l'état local avec le modèle édité
    setCvModel(editedModel);
  };

  return (
    <div className={`${styles['print-area']} ${styles.resume}`}>
      <div className={styles.container}>
        {/* Bouton de sauvegarde */}
        <div className={styles.editButton}>
          <button onClick={handleSave}><i className="fas fa-save"></i> Save</button>
        </div>
        <div className={styles.left_Side}>
          <div className={styles.profileText}>
            <div className={styles.imgBx}>
              <img src={avatar} alt="Profile" />  
            </div>
            {/* Formulaire pour modifier le nom et le titre */}
            <form>
              <input 
                type="text" 
                name="name" 
                value={cvModel.name} 
                onChange={handleChange} 
                placeholder="Your Name" 
                className={styles.input}
              />
              <input 
                type="text" 
                name="jobTitle" 
                value={cvModel.jobTitle} 
                onChange={handleChange} 
                placeholder="Your Job Title" 
                className={styles.input}
              />
            </form>
          </div>
          <div className={styles.contactInfo}>
            <h3 className={styles.title}>Contact Info</h3>
            <ul>
              <li>
                <span className={styles.icon}><i className="fa fa-phone" aria-hidden="true"></i></span>
                
                <input
                  type="text"
                  name="phone"
                  value={cvModel.phone}
                  onChange={handleChange}
                  className={styles.input}
                />
              </li>
              <li>
                <span className={styles.icon}><i className="fa fa-envelope" aria-hidden="true"></i></span>
                <input
                  type="text"
                  name="email"
                  value={cvModel.email}
                  onChange={handleChange}
                  className={styles.input}
                />
              </li>
              <li>
                <span className={styles.icon}><i className="fa fa-globe" aria-hidden="true"></i></span>
                <input
                  type="text"
                  name="website"
                  value={cvModel.website}
                  onChange={handleChange}
                  className={styles.input}
                />
              </li>
              <li>
                <span className={styles.icon}><i className="fa fa-linkedin" aria-hidden="true"></i></span>
                <input
                  type="text"
                  name="linkedin"
                  value={cvModel.linkedin}
                  onChange={handleChange}
                  className={styles.input}
                />
              </li>
              <li>
                <span className={styles.icon}><i className="fa fa-map-marker" aria-hidden="true"></i></span>
                <input
                  type="text"
                  name="address"
                  value={cvModel.address}
                  onChange={handleChange}
                  className={styles.input}
                />
              </li>
            </ul>
          </div>
          <div className={`${styles.contactInfo} ${styles.education}`}>
            <h3 className={styles.title}>EDUCATION</h3>
            {/* Votre contenu d'éducation ici */}
          </div>
          <div className={`${styles.contactInfo} ${styles.languages}`}>
            <h3 className={styles.title}>LANGUAGES</h3>
            {/* Votre contenu de langues ici */}
          </div>
        </div>
        <div className={styles.right_Side}>
          {/* Votre contenu de droite ici */}
        </div>
        {/* Composant ModeleEdit pour éditer le modèle de CV */}
        <ModeleEdit onEdit={handleEdit} loadModel={loadModel} />
      </div>
    </div>
  );
}

export default ParentComponent;
