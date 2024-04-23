import React, { useState, useEffect } from "react";
import styles from './Admin.module.css';
import { FaUpload, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { PuffLoader } from "react-spinners";
import Swal from 'sweetalert2';
const Admin = () => {
  const [formData, setFormData] = useState({
    title: "",
    imageURL: "",
    content: "", // Ajout du champ content
    isImageLoading: false,
    progress: 0,
    image: null, // Ajout du champ image
  });

  const [cvList, setCVList] = useState([]);
  const [isCreatingCV, setIsCreatingCV] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:8080/getCVs");
      if (response.ok) {
        const data = await response.json();
        setCVList(data);
      } else {
        toast.error("Failed to fetch CVs");
      }
    } catch (error) {
      console.error("Error fetching CVs:", error);
      toast.error("Error fetching CVs");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Image = reader.result.split(',')[1]; // Obtenez la partie base64 des données de l'image
        console.log('Base64 image:', base64Image); // Ajoutez cette ligne pour vérifier les données de l'image
        setFormData((prevData) => ({
          ...prevData,
          imageURL: reader.result,
          image: base64Image, // Mettez à jour le champ image avec la partie base64 des données de l'image
        }));
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUploadClick = async () => {
    console.log('Form data before sending:', formData); // Ajoutez cette ligne pour vérifier le contenu de formData
  
    if (!formData.title || !formData.imageURL || !formData.content || !formData.image) {
      toast.error("Title, image, content, and image URL are required");
      return;
    }
  
    setIsCreatingCV(true); // Démarrez le chargement
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token is missing or undefined. Make sure it is set correctly.');
        return;
      }
  
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('imageURL', formData.imageURL);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('image', formData.image);
  
      const response = await fetch("http://localhost:8080/createCV", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });
  
      if (!response.ok) {
        throw new Error("Failed to create CV");
      }
  
      toast.success("CV created successfully!");
      fetchData();
      setFormData({
        title: "",
        imageURL: "",
        content: "",
        isImageLoading: false,
        progress: 0,
        image: null,
      });
    } catch (error) {
      console.error("Error creating CV:", error);
      toast.error("Error creating CV");
    } finally {
      setIsCreatingCV(false); // Arrêtez le chargement
    }
  };
  

 /*  const handleUpdateClick = async (cvId) => {
    // Update logic here. This is a placeholder.
    console.log("Update CV:", cvId);
  }; */

  const handleDeleteClick = async (cvId) => {
    // SweetAlert2 pour la confirmation de suppression
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Vous ne pourrez pas revenir en arrière !",
      icon: 'warning',
      width: '460px',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimez-le !',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        // L'utilisateur confirme la suppression
        fetch(`http://localhost:8080/deleteCV/${cvId}`, {
          method: "DELETE",
        })
        .then(response => {
          if (response.ok) {
            Swal.fire(
              'Supprimé!',
              'Le CV a été supprimé.',
              'success'
            )
            fetchData(); // Rafraîchir les données
          } else {
            throw new Error('Failed to delete CV');
          }
        })
        .catch(error => {
          console.error("Erreur lors de la suppression du CV :", error);
          Swal.fire(
            'Erreur!',
            'Une erreur est survenue lors de la suppression du CV.',
            'error'
          );
        });
      }
    });
  };
  
  

  return (
    <div className={styles.container}>
      <div className={styles['upload-container']}>
        <div>
          <p>Créer un nouveau modèle</p>
          <input
            name="title"
            className={styles['input-title']}
            type="text"
            placeholder="Titre de template"
            value={formData.title}
            onChange={handleInputChange}
          />
          <textarea
            name="content"
            className={styles['input-content']}
            placeholder="lien de cv "
            value={formData.content}
            onChange={handleInputChange}
          />
        </div>
        <div className={styles['image-upload-container']}>
          {formData.imageURL ? (
            <img src={formData.imageURL} alt="Preview" className={styles['image-preview']} />
          ) : (
            <label className={styles['upload-label']}>
              <FaUpload className={styles['upload-icon']} />
              <p>Cliquer pour importer</p>
              <input
                type="file"
                name="image"
                className={styles['file-input']}
                accept="image/jpeg, image/jpg, image/png"
                onChange={handleFileSelect}
              />
            </label>
          )}
          {formData.imageURL && !isCreatingCV && (
            <button className={styles['upload-btn']} onClick={handleUploadClick}>
              Créer le CV
            </button>
          )}
          {isCreatingCV && (
            <div className={styles['loading-container']}>
              <PuffLoader color="#4A90E2" size={60} />
              <p>Creating CV...</p>
            </div>
          )}
        </div>
      </div>
      <div className={styles['cv-list'] + " " + styles['grid-view']}>
        {cvList.map((cv) => (
          <div key={cv._id} className={styles['cv-item'] + " " + styles['grid-item']}>
            <img src={cv.imageURL} alt={cv.title} className={styles['cv-image']} />
            <div className={styles['cv-details']}>
              <p className={styles['cv-title']}>{cv.title}</p>
              <div className={styles['cv-actions']}>
                <FaTrash className={styles['action-icon']} onClick={() => handleDeleteClick(cv._id)} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;