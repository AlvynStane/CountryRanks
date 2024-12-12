import React from 'react';
import './Card.css';

const Card = ({ article }) => {
  const { title, abstract, multimedia, url } = article;

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="card">
      {multimedia.length > 0 && (
        <img src={multimedia[0].url} alt={title} className="card-image" />
      )}
      <h3 className="card-title">{title}</h3>
      <p className="card-abstract">{abstract}</p>
    </a>
  );
};

export default Card;