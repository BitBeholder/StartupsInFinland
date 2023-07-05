const pgp = require('pg-promise')();

const db = pgp({
  host: 'localhost',
  port: 5432,
  database: 'startups2',
  user: 'postgres',
  password: '9551'
});

db.none(`
  CREATE TABLE IF NOT EXISTS startups (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    founded INTEGER,
    category TEXT,
    city TEXT,
    website TEXT,
    description TEXT
  )
`)
.then(() => {
  console.log('Created startups table');
})
.catch((err) => {
  console.error(err.message);
});

module.exports = db;