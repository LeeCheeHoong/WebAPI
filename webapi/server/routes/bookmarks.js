const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Bookmark = require('../models/Bookmark');

// Add anime to list
router.post('/', auth, async (req, res) => {
  const { animeId, title, image_url, synopsis, episodes, score, aired, url, status } = req.body;
  const genres = req.body.genres ? req.body.genres.map(genre => genre.name) : [];

  try {
    const newBookmark = new Bookmark({
      userId: req.user.id,
      animeId,
      title,
      image_url,
      synopsis,
      episodes,
      score,
      genres,
      aired,
      url,
      status,
    });

    const bookmark = await newBookmark.save();
    res.json(bookmark);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get user's anime list
router.get('/', auth, async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ userId: req.user.id });
    res.json(bookmarks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update anime status
router.put('/:id', auth, async (req, res) => {
  const { status } = req.body;

  try {
    let bookmark = await Bookmark.findById(req.params.id);

    if (!bookmark) {
      return res.status(404).json({ msg: 'Bookmark not found' });
    }

    // Make sure user owns the anime
    if (bookmark.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    bookmark = await Bookmark.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true }
    );

    res.json(bookmark);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete anime from list
router.delete('/:id', auth, async (req, res) => {
  try {
    let bookmark = await Bookmark.findById(req.params.id);

    if (!bookmark) {
      return res.status(404).json({ msg: 'Bookmark not found' });
    }

    // Make sure user owns the anime
    if (bookmark.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Bookmark.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Bookmark removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;