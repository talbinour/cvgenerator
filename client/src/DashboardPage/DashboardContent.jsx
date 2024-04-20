import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const DashboardContent = () => {
  const { cvId } = useParams();
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const fetchImageUrl = async () => {
      try {
        if (cvId) {
          const response = await axios.get(`http://localhost:8080/getImage/${cvId}`);
          if (response.data && response.data.imageUrl) {
            setImageUrl(response.data.imageUrl);
          } else {
            console.error('Image URL not found in response data');
          }
        } else {
          console.error('CV ID not provided in the URL');
        }
      } catch (error) {
        console.error('Error fetching image URL:', error);
      }
    };
  
    fetchImageUrl();
  }, [cvId]);

  return (
    <section className='hero'>
      <h1>DashboardContent</h1>
      {imageUrl && (
        <a href={imageUrl} target="_blank" rel="noopener noreferrer">
          <img src={imageUrl} alt='CV' />
        </a>
      )}
    </section>
  );
};

export default DashboardContent;
