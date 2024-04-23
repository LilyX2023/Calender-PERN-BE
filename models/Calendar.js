const pool = require('./connection');

// Define schema query
const createCalendarTableQuery = `
  CREATE TABLE IF NOT EXISTS calendar (
    calendar_id SERIAL PRIMARY KEY,
    calendar_name VARCHAR(255) NOT NULL
  );
`;

// Create todos table
pool.query(createCalendarTableQuery)
  .then(res => console.log('events table created successfully'))
  .catch(err => console.error('Error creating events table:', err));

module.exports = pool;