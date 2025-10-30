const express = require('express');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// PostgreSQL connection pool
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'testdb',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

// Middleware
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// Database test endpoint
app.get('/api/test', async (req, res) => {
  try {
    // Test database connection
    const result = await pool.query('SELECT version()');

    res.json({
      status: 'success',
      message: 'Database connection successful',
      timestamp: new Date().toISOString(),
      database: {
        version: result.rows[0].version,
      },
    });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({
      status: 'error',
      message: `Database connection failed: ${error.message}`,
      timestamp: new Date().toISOString(),
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Claude Docker Test API',
    endpoints: {
      health: 'GET /health',
      databaseTest: 'GET /api/test',
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint not found',
    path: req.path,
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    error: err.message,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`💾 Database test: http://localhost:${PORT}/api/test`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing server gracefully...');
  await pool.end();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('\nSIGINT received, closing server gracefully...');
  await pool.end();
  process.exit(0);
});
