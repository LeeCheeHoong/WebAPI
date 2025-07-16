import React from 'react';

const AnimeCard = ({ anime, onAddToList, onClick, user }) => {
  return (
    <div className="anime-card" onClick={() => onClick(anime)}>
      {anime.images && anime.images.jpg && (
        <img src={anime.images.jpg.image_url} alt={anime.title} width="100" />
      )}
      <div>
        <h3>{anime.title}</h3>
        <p>{anime.synopsis ? `${anime.synopsis.substring(0, 150)}...` : 'No synopsis available.'}</p>
      </div>
      {user && (
        <button onClick={(e) => {
          e.stopPropagation(); // Prevent modal from opening when button is clicked
          onAddToList(anime);
        }}>Add to Watchlist</button>
      )}
    </div>
  );
};

export default AnimeCard;