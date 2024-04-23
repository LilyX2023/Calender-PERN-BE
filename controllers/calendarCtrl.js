const express = require('express');
const router = express.Router();
const pool = require('../models/Calendar'); // Import the pool object

// GET all calendars
router.get('/', async (req, res) => {
  try {
    const calendars = await pool.query('SELECT * FROM calendar');
    res.json(calendars.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST a new calendar
router.post('/', async (req, res) => {
  try {
    const { calendar_name } = req.body;
    const result = await pool.query('INSERT INTO calendar (calendar_name) VALUES ($1) RETURNING *', [calendar_name]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE a calendar by ID
router.delete('/:calendar_id', async (req, res) => {
  try {
    const { calendar_id } = req.params;
    const result = await pool.query('DELETE FROM calendar WHERE calendar_id=$1 RETURNING *', [calendar_id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Calendar not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET a calendar by ID
router.get('/:calendar_id', async (req, res) => {
  try {
    const { calendar_id } = req.params;
    const result = await pool.query('SELECT * FROM calendar WHERE calendar_id=$1', [calendar_id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Calendar not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT (update) a calendar by ID
router.put('/:calendar_id', async (req, res) => {
  try {
    const { calendar_id } = req.params;
    const { calendar_name } = req.body;
    const result = await pool.query('UPDATE calendar SET calendar_name=$1 WHERE calendar_id=$2 RETURNING *', [calendar_name, calendar_id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Calendar not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;