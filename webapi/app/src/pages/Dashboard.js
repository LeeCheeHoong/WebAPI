
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import AnimeDetailModal from '../components/AnimeDetailModal';

const Dashboard = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loadingBookmarks, setLoadingBookmarks] = useState(true);
  const [errorBookmarks, setErrorBookmarks] = useState(null);

  const [selectedAnime, setSelectedAnime] = useState(null);

  const fetchBookmarks = async () => {
    setLoadingBookmarks(true);
    setErrorBookmarks(null);
    try {
      const res = await api.get('/bookmarks');
      setBookmarks(res.data);
    } catch (err) {
      setErrorBookmarks('Failed to fetch bookmarks. Please try again.');
      console.error('Failed to fetch bookmarks', err);
    } finally {
      setLoadingBookmarks(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await api.put(`/bookmarks/${id}`, { status: newStatus });
      fetchBookmarks();
    } catch (error) {
      console.error('Failed to update status', error);
      alert('Failed to update status.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/bookmarks/${id}`);
      fetchBookmarks();
    } catch (error) {
      console.error('Failed to delete bookmark', error);
      alert('Failed to delete bookmark.');
    }
  };

  const handleBookmarkClick = (bookmark) => {
    // For bookmarked anime, we have title, image_url, synopsis directly.
    // If more details are needed, we would fetch them here using bookmark.animeId
    setSelectedAnime({
      mal_id: bookmark.animeId,
      title: bookmark.title,
      images: { jpg: { image_url: bookmark.image_url } },
      synopsis: bookmark.synopsis,
      episodes: bookmark.episodes,
      score: bookmark.score,
      genres: bookmark.genres || [],
      aired: bookmark.aired,
      url: bookmark.url,
    });
  };

  const handleCloseModal = () => {
    setSelectedAnime(null);
  };

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <h3>My Watchlist</h3>
      {loadingBookmarks ? (
        <p>Loading watchlist...</p>
      ) : errorBookmarks ? (
        <p style={{ color: 'red' }}>{errorBookmarks}</p>
      ) : bookmarks.length === 0 ? (
        <p>Your watchlist is empty. Search for anime to add!</p>
      ) : (
        <ul>
          {bookmarks.map((bookmark) => (
            <li key={bookmark._id} onClick={() => handleBookmarkClick(bookmark)}>
              {bookmark.image_url && (
                <img src={bookmark.image_url} alt={bookmark.title} width="50" />
              )}
              <div>
                <h4>{bookmark.title}</h4>
                <p>Status: {bookmark.status}</p>
              </div>
              <select
                value={bookmark.status}
                onChange={(e) => handleUpdateStatus(bookmark._id, e.target.value)}
                onClick={(e) => e.stopPropagation()} // Prevent modal from opening when select is clicked
              >
                <option value="to-watch">Plan to Watch</option>
                <option value="watching">Watching</option>
                <option value="completed">Completed</option>
                <option value="dropped">Dropped</option>
              </select>
              <button onClick={(e) => {
                e.stopPropagation(); // Prevent modal from opening when button is clicked
                handleDelete(bookmark._id);
              }}>Delete</button>
            </li>
          ))}
        </ul>
      )}

      {selectedAnime && (
        <AnimeDetailModal anime={selectedAnime} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default Dashboard;
