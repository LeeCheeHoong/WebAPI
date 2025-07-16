const mongoose = require('mongoose');

const AnimeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  animeId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['watching', 'completed', 'to-watch', 'dropped'],
    required: true,
  },
});

module.exports = mongoose.model('Anime', AnimeSchema);