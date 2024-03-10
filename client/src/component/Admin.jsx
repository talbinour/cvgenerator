import React, { useState, useRef, useEffect } from "react";
import "./Admin.css";
import { PuffLoader } from "react-spinners";
import { FaUpload, FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

const Admin = () => {
  const [formData, setFormData] = useState({
    title: "",
    imageURL: null,
    isImageLoading: false,
    progress: 0,
  });

  const [cvList, setCVList] = useState([]);

  const fileInputRef = useRef(null);

  useEffect(() => {
    // Fetch data when component mounts (e.g., for updating CV list)
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3000/cv/getCVs");
      if (response.ok) {
        const data = await response.json();
        setCVList(data); // Update CV list
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

  const handleLabelClick = () => {
    // Trigger the hidden file input
    fileInputRef.current.click();
  };

  const handleFileSelect = async (e) => {
    const selectedFile = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      isImageLoading: true,
    }));

    if (selectedFile && isAllowed(selectedFile)) {
      try {
        const formData = new FormData();
        formData.append("image", selectedFile);

        const response = await fetch("http://localhost:3000/cv/uploadImage", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();

          setFormData((prevData) => ({
            ...prevData,
            isImageLoading: false,
            progress: 100,
            imageURL: data.imageURL,
          }));

          toast.success("Image uploaded successfully!");
        } else {
          toast.error("Failed to upload image");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Error uploading image");
      }
    } else {
      toast.error("Invalid File Format");
    }
  };

  const isAllowed = (file) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    return allowedTypes.includes(file.type);
  };

  const handleUploadClick = async () => {
    try {
      const formData = new FormData();
      formData.append("title", formData.title);
      formData.append("imageURL", formData.imageURL);

      const response = await fetch("http://localhost:3000/cv/createCV", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();

        setFormData((prevData) => ({
          ...prevData,
          isImageLoading: false,
          progress: 100,
          imageURL: data.imageURL,
        }));

        toast.success("CV created successfully!");
        // Refresh the CV list after creating a new CV
        fetchData();
      } else {
        toast.error("Failed to create CV");
      }
    } catch (error) {
      console.error("Error creating CV:", error);
      toast.error("Error creating CV");
    }
  };

  const handleUpdateClick = async (cvId) => {
    try {
      const formData = new FormData();
      formData.append("title", formData.title);
      formData.append("imageURL", formData.imageURL);

      const response = await fetch(`http://localhost:3000/cv/updateCV/${cvId}`, {
        method: "PUT",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();

        setFormData((prevData) => ({
          ...prevData,
          isImageLoading: false,
          progress: 100,
          imageURL: data.imageURL,
        }));

        toast.success("CV updated successfully!");
        // Refresh the CV list after updating the CV
        fetchData();
      } else {
        toast.error("Failed to update CV");
      }
    } catch (error) {
      console.error("Error updating CV:", error);
      toast.error("Error updating CV");
    }
  };

  const handleDeleteClick = async (cvId) => {
    try {
      const response = await fetch(`http://localhost:3000/cv/deleteCV/${cvId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("CV deleted successfully!");
        // Refresh the CV list after deleting the CV
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
    <div className="w-full px-4 lg:px-10 2xl:px-32 py-4 grid grid-cols-1 lg:grid-cols-2">
      <div className="col-span-1 lg:col-span-1 bg-gray-300 p-4 max-w-full">
        <div className="w-full">
          <p>Create a new Template</p>
          <div className="flex-paragraphs">
            <p className="text-base text-txtLight uppercase font-semibold mr-2">
              TempID:
            </p>
            <p className="text-sm text-txtDark capitalize font-bold mr-2">
              Template1
            </p>
          </div>
          <input
            name="title"
            className={`w-full px-4 py-3 rounded-md bg-transparent border border-gray-300 text-lg text-txtPrimary focus:text-txtDark focus:shadow-md outline-none ${formData.isImageLoading ? 'pointer-events-none' : ''}`}
            type="text"
            placeholder="Template Title"
            value={formData.title}
            onChange={handleInputChange}
          />
        </div>
        <div className="w-full border border-gray-300 rounded-md p-4">
          <div className="w-full bg-gray-400 backdrop-blur-nd h-[420px] lg:h-[620px] 2xl:h-[740px] rounded-md cursor-pointer flex items-center justify-center" onClick={handleLabelClick}>
            {formData.isImageLoading ? (
              <div className="flex flex-col items-center justify-center gap-4">
                <PuffLoader color="#849BFCD" size={40} />
                <p>{formData.progress.toFixed(2)}%</p>
              </div>
            ) : (
              <label className="w-full cursor-pointer h-full flex flex-col items-center justify-center">
              <FaUpload className="text-2xl mb-2" />
              <p className="text-lg text-txtLight mb-2">Click to upload</p>
              {/* Hide the file input */}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".jpeg, .jpg, .png"
                onChange={handleFileSelect}
              />
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2"
                onClick={handleUploadClick}
                style={{ alignSelf: 'center', maxWidth: '200px' }}
              >
                Create CV
              </button>
            </label>
            )}
          </div>
        </div>
      </div>
      <div className="col-span-1 lg:col-span-1 bg-gray-300 p-4">
        <p>CV List</p>
        <ul>
          {cvList.map((cv) => (
            <li key={cv._id} className="mb-4">
              <div>
                <img src={cv.imageURL} alt="CV Template" className="mt-2" />
              </div>
              <div>
                <p>Title: {cv.title}</p>
              </div>
              <div>
                <button
                  className="bg-yellow-500 text-white px-2 py-1 rounded-md mr-2"
                  onClick={() => handleUpdateClick(cv._id)}
                >
                  <FaEdit className="mr-1" />
                  Update
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded-md"
                  onClick={() => handleDeleteClick(cv._id)}
                >
                  <FaTrash className="mr-1" />
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Admin;
