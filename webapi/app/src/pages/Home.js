import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import AnimeCard from '../components/AnimeCard';
import AnimeDetailModal from '../components/AnimeDetailModal';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const [seasonalAnime, setSeasonalAnime] = useState([]);
  const [loadingSeasonal, setLoadingSeasonal] = useState(true);
  const [errorSeasonal, setErrorSeasonal] = useState(null);
  const [seasonalPage, setSeasonalPage] = useState(1);
  const [seasonalHasNextPage, setSeasonalHasNextPage] = useState(false);

  const [query, setQuery] = useState('');
  const [searchYear, setSearchYear] = useState('');
  const [searchSeason, setSearchSeason] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [errorSearch, setErrorSearch] = useState(null);
  const [searchPage, setSearchPage] = useState(1);
  const [searchHasNextPage, setSearchHasNextPage] = useState(false);

  const [selectedAnime, setSelectedAnime] = useState(null);

  const { user } = useContext(AuthContext);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i); // Last 5 years
  const seasons = ['winter', 'spring', 'summer', 'fall'];

  const fetchSeasonalAnime = async (page) => {
    setLoadingSeasonal(true);
    setErrorSeasonal(null);
    try {
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth();
      let season;

      if (month >= 2 && month <= 4) {
        season = 'spring';
      } else if (month >= 5 && month <= 7) {
        season = 'summer';
      } else if (month >= 8 && month <= 10) {
        season = 'fall';
      } else {
        season = 'winter';
      }

      const res = await api.get(`/jikan/season/${year}/${season}?page=${page}`);
      setSeasonalAnime(res.data.data);
      setSeasonalHasNextPage(res.data.pagination.has_next_page);
    } catch (err) {
      setErrorSeasonal('Failed to fetch seasonal anime. Please try again later.');
      console.error('Failed to fetch seasonal anime', err);
    } finally {
      setLoadingSeasonal(false);
    }
  };

  useEffect(() => {
    fetchSeasonalAnime(seasonalPage);
  }, [seasonalPage]);

  const handleSearch = async (page) => {
    setLoadingSearch(true);
    setErrorSearch(null);
    setSearchResults([]); // Clear previous search results

    try {
      let res;
      if (query) {
        res = await api.get(`/jikan/search?name=${query}&page=${page}`);
      } else if (searchYear && searchSeason) {
        res = await api.get(`/jikan/season/${searchYear}/${searchSeason}?page=${page}`);
      } else if (searchYear) {
        res = await api.get(`/jikan/filter?year=${searchYear}&page=${page}`);
      } else {
        setErrorSearch('Please enter a search query or select a year/season.');
        setLoadingSearch(false);
        return;
      }
      setSearchResults(res.data.data);
      setSearchHasNextPage(res.data.pagination.has_next_page);
      setSearchPage(page); // Update the current search page state
    } catch (err) {
      setErrorSearch('Failed to search anime. Please try again.');
      console.error('Failed to search anime', err);
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleSearch(1); // Always start from page 1 for a new search
  };

  const handleAddToList = async (anime) => {
    try {
      await api.post('/bookmarks', {
        animeId: anime.mal_id,
        title: anime.title,
        image_url: anime.images?.jpg?.image_url,
        synopsis: anime.synopsis,
        episodes: anime.episodes,
        score: anime.score,
        genres: anime.genres ? anime.genres.map(g => g.name) : [],
        aired: anime.aired,
        url: anime.url,
        status: 'to-watch',
      });
      alert('Anime added to watchlist!');
    } catch (error) {
      console.error('Failed to add anime to watchlist', error);
      alert('Failed to add anime to watchlist.');
    }
  };

  const handleCardClick = (anime) => {
    setSelectedAnime(anime);
  };

  const handleCloseModal = () => {
    setSelectedAnime(null);
  };

  const handleSeasonalPrevPage = () => {
    setSeasonalPage((prev) => Math.max(1, prev - 1));
  };

  const handleSeasonalNextPage = () => {
    setSeasonalPage((prev) => prev + 1);
  };

  const handleSearchPrevPage = () => {
    setSearchPage((prev) => Math.max(1, prev - 1));
  };

  const handleSearchNextPage = () => {
    setSearchPage((prev) => prev + 1);
  };

  return (
    <div>
      <h1>Welcome to the Anime Watchlist App</h1>

      <h2>Search Anime</h2>
      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSearchYear(''); // Clear year/season when typing query
            setSearchSeason('');
            setSearchPage(1); // Reset page on new search
          }}
          placeholder="Search by name"
          disabled={loadingSearch}
        />
        <input
          type="number"
          value={searchYear}
          onChange={(e) => {
            setSearchYear(e.target.value);
            setQuery(''); // Clear query when selecting year/season
            setSearchPage(1); // Reset page on new search
          }}
          placeholder="Filter by year (e.g., 2023)"
          disabled={loadingSearch}
        />
        <select
          value={searchSeason}
          onChange={(e) => {
            setSearchSeason(e.target.value);
            setQuery(''); // Clear query when selecting year/season
            setSearchPage(1); // Reset page on new search
          }}
          disabled={loadingSearch}
        >
          <option value="">Select Season</option>
          {seasons.map((season) => (
            <option key={season} value={season}>{season.charAt(0).toUpperCase() + season.slice(1)}</option>
          ))}
        </select>
        <button type="submit" disabled={loadingSearch}>
          {loadingSearch ? 'Searching...' : 'Search'}
        </button>
      </form>
      {errorSearch && <p style={{ color: 'red' }}>{errorSearch}</p>}

      {searchResults.length > 0 && (
        <>
          <h3>Search Results</h3>
          <div className="anime-grid">
            {searchResults.map((anime) => (
              <AnimeCard key={anime.mal_id} anime={anime} onAddToList={handleAddToList} onClick={handleCardClick} user={user} />
            ))}
          </div>
          <div className="pagination">
            <button onClick={() => handleSearch(searchPage - 1)} disabled={searchPage === 1 || loadingSearch}>Previous</button>
            <span>Page {searchPage}</span>
            <button onClick={() => handleSearch(searchPage + 1)} disabled={!searchHasNextPage || loadingSearch}>Next</button>
          </div>
        </>
      )}

      <h2>Anime This Season</h2>
      {loadingSeasonal ? (
        <p>Loading seasonal anime...</p>
      ) : errorSeasonal ? (
        <p style={{ color: 'red' }}>{errorSeasonal}</p>
      ) : (seasonalAnime.length > 0 ? (
        <>
          <div className="anime-grid">
            {seasonalAnime.map((anime) => (
              <AnimeCard key={anime.mal_id} anime={anime} onAddToList={handleAddToList} onClick={handleCardClick} user={user} />
            ))}
          </div>
          <div className="pagination">
            <button onClick={handleSeasonalPrevPage} disabled={seasonalPage === 1 || loadingSeasonal}>Previous</button>
            <span>Page {seasonalPage}</span>
            <button onClick={handleSeasonalNextPage} disabled={!seasonalHasNextPage || loadingSeasonal}>Next</button>
          </div>
        </>
      ) : (
        <p>No seasonal anime found.</p>
      ))}

      {selectedAnime && (
        <AnimeDetailModal anime={selectedAnime} onClose={handleCloseModal} onAddToList={handleAddToList} user={user} />
      )}
    </div>
  );
};

export default Home;