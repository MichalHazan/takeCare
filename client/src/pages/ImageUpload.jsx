import React, { useState } from 'react';
import axios from 'axios';

const ImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);

  const handleUpload = async (event) => {
    try {
      setUploading(true);
      setError(null);
      
      const files = event.target.files;
      const formData = new FormData();
      
      Array.from(files).forEach(file => {
        formData.append('images', file);
      });

      const response = await axios.post('/api/galery/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setImages(prevImages => [...prevImages, ...response.data.imageUrls]);
      event.target.value = ''; // Reset file input
    } catch (err) {
      setError(err.message || 'Error uploading images');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleUpload}
        disabled={uploading}
      />
      
      {uploading && <p>Uploading...</p>}
      {error && <p className="error">{error}</p>}
      
      <div className="images-preview">
        {images.map((url, index) => (
          <img 
            key={index}
            src={url}
            alt={`Upload ${index + 1}`}
            style={{ width: '150px', height: '150px', objectFit: 'cover' }}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageUpload;