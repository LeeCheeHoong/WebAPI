const mongoose = require('mongoose');

const BookmarkSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  animeId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  image_url: {
    type: String,
  },
  synopsis: {
    type: String,
  },
  episodes: {
    type: Number,
  },
  score: {
    type: Number,
  },
  genres: [
    {
      type: String,
    },
  ],
  aired: {
    from: Date,
    to: Date,
    string: String,
  },
  url: {
    type: String,
  },
  status: {
    type: String,
    enum: ['watching', 'completed', 'to-watch', 'dropped'],
    required: true,
  },
});

module.exports = mongoose.model('Bookmark', BookmarkSchema);