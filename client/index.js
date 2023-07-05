const express = require('express');
const db = require('./database.js');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/startups', (req, res) => {
    const { name, field, location, size, description, website } = req.body;
    const sql = `INSERT INTO startups(name, field, location, size, description, website) VALUES(?,?,?,?,?,?)`;
    db.run(sql, [name, field, location, size, description, website], function(err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      return res.json({ id: this.lastID });
    });
});
 
app.get('/startups', (req, res) => {
    const sql = `SELECT * FROM startups`;
    db.all(sql, [], (err, rows) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      return res.json(rows);
    });
});

app.put('/startups/:id', (req, res) => {
    const { id } = req.params;
    const { name, field, location, size, description, website } = req.body;
    const sql = `UPDATE startups SET name = ?, field = ?, location = ?, size = ?, description = ?, website = ? WHERE id = ?`;
    db.run(sql, [name, field, location, size, description, website, id], function(err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      return res.json({ changes: this.changes });
    });
});
 
app.delete('/startups/:id', (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM startups WHERE id = ?`;
    db.run(sql, id, function(err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      return res.json({ message: "The startup was successfully deleted" });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
