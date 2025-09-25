const express = require('express');
const helmet = require('helmet'); // ✅ security best practice
const app = express();
const PORT = process.env.PORT || 3000;

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

// ✅ Start server with error handling
app.listen(PORT, (err) => {
  if (err) {
    console.error(`❌ Failed to start server:`, err);
    process.exit(1);
  }
  console.log(`✅ App running on port ${PORT}`);
});

module.exports = app; // ✅ Export for testing


