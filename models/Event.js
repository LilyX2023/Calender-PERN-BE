const pool = require('./connection');

// Define schema query
const createEventsTableQuery = `
  CREATE TABLE IF NOT EXISTS events (
    event_id SERIAL PRIMARY KEY,
    calendar_id INT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    location VARCHAR(255),
    color VARCHAR(7),
    recurring BOOLEAN DEFAULT false,
    recurrence_pattern JSONB
  )
`;

// Create todos table
pool.query(createEventsTableQuery)
  .then(res => console.log('events table created successfully'))
  .catch(err => console.error('Error creating events table:', err));

module.exports = pool;