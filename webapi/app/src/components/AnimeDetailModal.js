
import React from 'react';

const AnimeDetailModal = ({ anime, onClose, onAddToList, user }) => {
  if (!anime) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}> {/* Prevent clicks inside from closing modal */}
        <button className="modal-close-button" onClick={onClose}>&times;</button>
        <h2>{anime.title}</h2>
        {anime.images && anime.images.jpg && (
          <img src={anime.images.jpg.large_image_url || anime.images.jpg.image_url} alt={anime.title} style={{ maxWidth: '200px', float: 'left', marginRight: '20px' }} />
        )}
        <p><strong>Synopsis:</strong> {anime.synopsis || 'No synopsis available.'}</p>
        {anime.episodes && <p><strong>Episodes:</strong> {anime.episodes}</p>}
        {anime.score && <p><strong>Score:</strong> {anime.score}</p>}
        {anime.genres && anime.genres.length > 0 && (
          <p><strong>Genres:</strong> {anime.genres.join(', ')}</p>
        )}
        {anime.aired && anime.aired.string && <p><strong>Aired:</strong> {anime.aired.string}</p>}
        {anime.url && <p><a href={anime.url} target="_blank" rel="noopener noreferrer">More Info on MyAnimeList</a></p>}
        {user && onAddToList && (
          <button onClick={() => onAddToList(anime)} style={{ marginTop: '20px', backgroundColor: '#007bff', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Add to Watchlist
          </button>
        )}
      </div>
    </div>
  );
};

export default AnimeDetailModal;
