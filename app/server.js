const app = require('./app');
const PORT = process.env.PORT || 3000;

// ✅ Start server with error handling
const server = app.listen(PORT, (err) => {
  if (err) {
    console.error(`❌ Failed to start server:`, err);
    process.exit(1);
  }
  console.log(`✅ App running on port ${PORT}`);
});

module.exports = server;



