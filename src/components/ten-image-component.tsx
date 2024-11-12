import React, { useEffect, useState } from 'react';
import  '../index.css';

interface ImagesComponentProps {
  departmentId: number | undefined;
  searchQuery: string;
}

interface ArtworkData {
  primaryImageSmall: string;
  title: string;
  department: string;
  objectName: string;
  objectURL: string;
}

export const ImagesComponent: React.FC<ImagesComponentProps> = ({ departmentId, searchQuery }) => {
  const [artworks, setArtworks] = useState<ArtworkData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (departmentId && searchQuery) {
      setIsLoading(true);
      fetch(`http://localhost:3000/getDatas?departamentsid=${departmentId}&inputValue=${searchQuery}`)
        .then(response => response.json())
        .then(result => {
          setIsLoading(false);
          if (result.data) {
            setArtworks(result.data);
            setError(null);
          } else {
            setArtworks([]);
            setError(result.message || 'No data found');
          }
        })
        .catch(error => {
          console.error('Error fetching artwork data:', error);
          setIsLoading(false);
          setError('An error occurred while fetching data');
        });
    }
  }, [departmentId, searchQuery]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="collection-container">
      <p className="collection-title">Explore the Collection</p>
      {error && <p className="error-message">{error}</p>}
      {artworks.map((artwork, index) => (
        <div key={index} className="artwork-card">
          <img src={artwork.primaryImageSmall} alt={artwork.title} className="artwork-image" />
          <div className="artwork-info">
            <h3 className="artwork-title">{artwork.title}</h3>
            <p className="artwork-object-name">{artwork.objectName}</p>
            <p className="artwork-department">{artwork.department}</p>
            <a href={artwork.objectURL} target="_blank" rel="noopener noreferrer" className="view-details">
              View more details
            </a>
          </div>
        </div>
      ))}
    </div>
  );

};
