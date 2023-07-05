const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./sif.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the SIF database.');
});

module.exports = db;

db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS startups (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        field TEXT,
        location TEXT,
        size INTEGER,
        description TEXT,
        website TEXT
      )
    `, (err) => {
      if (err) {
        console.error(err.message);
      }
    });
});

process.on('SIGINT', () => {
    db.close((err) => {
      if (err) {
        console.error(err.message);
      }
      console.log('Closed the database connection.');
    });
    process.exit(0);
});