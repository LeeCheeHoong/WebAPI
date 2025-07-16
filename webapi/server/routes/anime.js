const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Anime = require('../models/Anime');

// Add anime to list
router.post('/', auth, async (req, res) => {
  const { animeId, status } = req.body;

  try {
    const newAnime = new Anime({
      userId: req.user.id,
      animeId,
      status,
    });

    const anime = await newAnime.save();
    res.json(anime);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get user's anime list
router.get('/', auth, async (req, res) => {
  try {
    const animes = await Anime.find({ userId: req.user.id });
    res.json(animes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update anime status
router.put('/:id', auth, async (req, res) => {
  const { status } = req.body;

  try {
    let anime = await Anime.findById(req.params.id);

    if (!anime) {
      return res.status(404).json({ msg: 'Anime not found' });
    }

    // Make sure user owns the anime
    if (anime.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    anime = await Anime.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true }
    );

    res.json(anime);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete anime from list
router.delete('/:id', auth, async (req, res) => {
  try {
    let anime = await Anime.findById(req.params.id);

    if (!anime) {
      return res.status(404).json({ msg: 'Anime not found' });
    }

    // Make sure user owns the anime
    if (anime.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Anime.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Anime removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;