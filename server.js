const express = require('express');
const cors = require('cors');
const path = require('path');
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
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

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

// ==================== TODO API ENDPOINTS ====================

// GET /api/todos - Get all todos
app.get('/api/todos', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM todos ORDER BY created_at DESC'
    );
    res.json({
      status: 'success',
      data: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch todos',
      error: error.message,
    });
  }
});

// POST /api/todos - Create new todo
app.post('/api/todos', async (req, res) => {
  try {
    const { title } = req.body;

    // Validation
    if (!title || title.trim() === '') {
      return res.status(400).json({
        status: 'error',
        message: 'Title is required and cannot be empty',
      });
    }

    if (title.length > 255) {
      return res.status(400).json({
        status: 'error',
        message: 'Title cannot exceed 255 characters',
      });
    }

    const result = await pool.query(
      'INSERT INTO todos (title) VALUES ($1) RETURNING *',
      [title.trim()]
    );

    res.status(201).json({
      status: 'success',
      message: 'Todo created successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create todo',
      error: error.message,
    });
  }
});

// PATCH /api/todos/:id - Toggle completed status
app.patch('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validation
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid todo ID',
      });
    }

    // Check if todo exists
    const checkResult = await pool.query(
      'SELECT * FROM todos WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Todo not found',
      });
    }

    // Toggle completed status
    const result = await pool.query(
      'UPDATE todos SET completed = NOT completed WHERE id = $1 RETURNING *',
      [id]
    );

    res.json({
      status: 'success',
      message: 'Todo updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update todo',
      error: error.message,
    });
  }
});

// DELETE /api/todos/:id - Delete todo
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validation
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid todo ID',
      });
    }

    // Check if todo exists
    const checkResult = await pool.query(
      'SELECT * FROM todos WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Todo not found',
      });
    }

    await pool.query('DELETE FROM todos WHERE id = $1', [id]);

    res.json({
      status: 'success',
      message: 'Todo deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete todo',
      error: error.message,
    });
  }
});

// ==================== END TODO API ====================

// Root endpoint - redirect to index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
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
  console.log(`✅ TODO API: http://localhost:${PORT}/api/todos`);
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
