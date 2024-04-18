require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Only necessary if using SSL and want to bypass certificate validation
  }
});


module.exports = pool;