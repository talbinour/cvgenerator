import React, { useState, useEffect } from "react";
import "./Admin.css";
import { FaUpload, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { PuffLoader } from "react-spinners";

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
      const response = await fetch("http://localhost:8080/createCV", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Envoyez les données du formulaire sous forme de JSON
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
    try {
      const response = await fetch(`http://localhost:8080/deleteCV/${cvId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("CV deleted successfully!");
        fetchData();
      } else {
        toast.error("Failed to delete CV");
      }
    } catch (error) {
      console.error("Error deleting CV:", error);
      toast.error("Error deleting CV");
    }
  };

  return (
    <div className="container">
      <div className="upload-container">
        <div>
          <p>Créer un nouveau modèle</p>
          <input
            name="title"
            className="input-title"
            type="text"
            placeholder="Titre de template"
            value={formData.title}
            onChange={handleInputChange}
          />
          <textarea
            name="content"
            className="input-content"
            placeholder="Categorie du CV"
            value={formData.content}
            onChange={handleInputChange}
          />
        </div>
        <div className="image-upload-container">
          {formData.imageURL ? (
            <img src={formData.imageURL} alt="Preview" className="image-preview" />
          ) : (
            <label className="upload-label">
              <FaUpload className="upload-icon" />
              <p>Clicker pour importer</p>
              <input
                type="file"
                name="image"
                className="file-input"
                accept="image/jpeg, image/jpg, image/png"
                onChange={handleFileSelect}
              />
            </label>
          )}
          {formData.imageURL && !isCreatingCV && (
            <button className="upload-btn" onClick={handleUploadClick}>
              Créer le CV
            </button>
          )}
          {isCreatingCV && (
            <div className="loading-container">
              <PuffLoader color="#4A90E2" size={60} />
              <p>Creating CV...</p>
            </div>
          )}
        </div>
      </div>
      <div className="cv-list grid-view">
        {cvList.map((cv) => (
          <div key={cv._id} className="cv-item grid-item">
            <img src={cv.imageURL} alt={cv.title} className="cv-image" />
            <div className="cv-details">
              <p className="cv-title">{cv.title}</p>
              <div className="cv-actions">
                {/* <FaEdit className="action-icon" onClick={() => handleUpdateClick(cv._id)} /> */}
                <FaTrash className="action-icon" onClick={() => handleDeleteClick(cv._id)} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;