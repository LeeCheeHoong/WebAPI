const express = require('express');
const router = express.Router();
const axios = require('axios');

// Search for anime by name
router.get('/search', async (req, res) => {
  try {
    const { name, page } = req.query;
    if (!name) {
      return res.status(400).json({ message: 'Name query parameter is required' });
    }
    let newPage = 1;
    if (page) newPage = page;
    const response = await axios.get(`https://api.jikan.moe/v4/anime?q=${name}&page=${newPage}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data from Jikan API', error: error.message });
  }
});

// Filter anime by year
router.get('/filter', async (req, res) => {
  try {
    const { year, page } = req.query;
    if (!year) {
      return res.status(400).json({ message: 'Year query parameter is required' });
    }
    let newPage = 1
    if (page) newPage = page;
    const date = new Date(year)
    const response = await axios.get(`https://api.jikan.moe/v4/anime?start_date=${date.toISOString().split('T')[0]}&page=${newPage}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data from Jikan API', error: error.message });
  }
});

// Get anime by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`https://api.jikan.moe/v4/anime/${id}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data from Jikan API', error: error.message });
  }
});

// Get seasonal anime
router.get('/season/:year/:season', async (req, res) => {
  try {
    const { year, season } = req.params;
    const { page } = req.query;
    let newPage = 1;
    if (page) newPage = page;
    const response = await axios.get(`https://api.jikan.moe/v4/seasons/${year}/${season}?page=${newPage}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching seasonal anime from Jikan API', error: error.message });
  }
});

module.exports = router;