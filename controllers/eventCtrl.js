const express = require('express');
const router = express.Router();
const pool = require('../models/Event'); // Import the pool object

// GET all events
router.get('/calendar/:calendar_id/event', async (req, res) => {
  try {
    const { calendar_id } = req.params;
    const events = await pool.query(`SELECT * FROM events WHERE calendar_id = ${calendar_id}`);
    res.json(events.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST a new event
router.post('/calendar/:calendar_id/event', async (req, res) => {
  try {
    const { calendar_id, title, description, start_time, end_time, location, color, recurring, rrule } = req.body;
    const result = await pool.query('INSERT INTO events (calendar_id, title, description, start_time, end_time, location, color, recurring, rrule) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *', [calendar_id, title, description, start_time, end_time, location, color, recurring, rrule]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE a event by ID
router.delete('/calendar/:calendar_id/event/:event_id', async (req, res) => {
  try {
    const { event_id, calendar_id} = req.params;
    const result = await pool.query(`DELETE FROM events WHERE event_id=${event_id} AND calendar_id=${calendar_id}`);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Event not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET a event by ID
router.get('/calendar/:calendar_id/event/:event_id', async (req, res) => {
  try {
    const { event_id, calendar_id } = req.params;
    const result = await pool.query(`SELECT * FROM events WHERE event_id=${event_id} AND calendar_id=${calendar_id}`);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Event not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT (update) a event by ID
router.put('/calendar/:calendar_id/event/:event_id', async (req, res) => {
  try {
    const { event_id } = req.params;
    const { calendar_id, title, description, start_time, end_time, location, color, recurring, rrule } = req.body;
    const result = await pool.query('UPDATE events SET calendar_id=$1, title=$2, description=$3, start_time=$4, end_time=$5, location=$6, color=$7, recurring=$8, rrule=$9 WHERE event_id=$10 RETURNING *',
    [calendar_id, title, description, start_time, end_time, location, color, recurring, rrule, event_id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Event not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;