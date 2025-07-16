const serverless = require('serverless-http');
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
// const bodyParser = require('body-parser');

const app = express();

// Connect to database
connectDB();

// Init middleware
app.use(express.json());
// app.use(bodyParser.json({ type: () => true }));
app.use(cors());
app.use((req, res, next) => {
  // Fix body if it's a Buffer or raw string
  if (Buffer.isBuffer(req.body)) {
    try {
      req.body = JSON.parse(req.body.toString());
    } catch (e) {
      req.body = {};
    }
  } else if (typeof req.body === 'string') {
    try {
      req.body = JSON.parse(req.body);
    } catch (e) {
      req.body = {};
    }
  }

  // Fix query string: make sure it's an object
  if (typeof req.query === 'string') {
    try {
      req.query = JSON.parse(req.query);
    } catch (e) {
      req.query = {};
    }
  }

  // Fallback: if body is empty, use query
  if (
    !req.body ||
    (typeof req.body === 'object' && Object.keys(req.body).length === 0)
  ) {
    req.body = req.query || {};
  }

  next();
});



// Define routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/bookmarks', require('./routes/bookmarks'));
app.use('/api/jikan', require('./routes/jikan'));
// const port = process.env.PORT || 3001;

// app.listen(port, () => {
//   console.log(`Server started on port ${port}`);
// });
// Export the handler for serverless-http
module.exports.handler = serverless(app);
