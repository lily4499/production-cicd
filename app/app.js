const express = require('express');
const helmet = require('helmet'); // ✅ security best practice
const app = express();

// ✅ Middleware: secure headers + JSON body parsing
app.use(helmet());
app.use(express.json());

// ✅ Route handler with proper error handling
app.get('/', (req, res) => {
  try {
    res.status(200).send('Hello Production CI/CD!');
  } catch (error) {
    console.error('Error in / route:', error);
    res.status(500).send('Internal Server Error');
  }
});

// ✅ Health check endpoint (good DevOps practice)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

module.exports = app; // ✅ Export only app (no server started here)
