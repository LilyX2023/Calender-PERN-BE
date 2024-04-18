const express = require('express');
const router = express.Router();
const pool = require('../models/Event'); // Import the pool object

// GET all events
router.get('/', async (req, res) => {
  try {
    const events = await pool.query('SELECT * FROM events');
    res.json(events.rows);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST a new event
router.post('/', async (req, res) => {
  try {
    const { calendar_id, title, description, start_time, end_time, location, color, recurring, recurrence_pattern } = req.body;
    const result = await pool.query('INSERT INTO events (user_id, calendar_id, title, description, start_time, end_time, location, color, recurring, recurrence_pattern) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *', [calendar_id, title, description, start_time, end_time, location, color, recurring, recurrence_pattern]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE a event by ID
router.delete('/:id', async (req, res) => {
  try {
    const { event_id } = req.params;
    const result = await pool.query('DELETE FROM events WHERE event_id=$1 RETURNING *', [event_id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Event not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET a event by ID
router.get('/:id', async (req, res) => {
  try {
    const { event_id } = req.params;
    const result = await pool.query('SELECT * FROM events WHERE event_id=$1', [event_id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Event not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT (update) a todo by ID
router.put('/:id', async (req, res) => {
  try {
    const { event_id } = req.params;
    const { calendar_id, title, description, start_time, end_time, location, color, recurring, recurrence_pattern } = req.body;
    const result = await pool.query('UPDATE events SET user_id=$1, calendar_id=$2, title=$3, description=$4, start_time=$5, end_time=$6, location=$7, color=$8, recurring=$9, recurrence_pattern=$10 WHERE event_id=$11 RETURNING *',
    [calendar_id, title, description, start_time, end_time, location, color, recurring, recurrence_pattern, event_id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Event not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;