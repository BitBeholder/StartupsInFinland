const express = require('express');
const db = require('./database.js');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/startups', (req, res) => {
    const { name, field, location, size, description, website } = req.body;
    const sql = `INSERT INTO startups(name, field, location, size, description, website) VALUES($1, $2, $3, $4, $5, $6) RETURNING id`;
    db.one(sql, [name, field, location, size, description, website])
      .then(data => res.json({ id: data.id }))
      .catch(err => res.status(400).json({ error: err.message }));
});
 
app.get('/startups', (req, res) => {
    const sql = `SELECT * FROM startups`;
    db.any(sql)
      .then(rows => res.json(rows))
      .catch(err => res.status(400).json({ error: err.message }));
});

app.put('/startups/:id', (req, res) => {
    const { id } = req.params;
    const { name, field, location, size, description, website } = req.body;
    const sql = `UPDATE startups SET name = $1, field = $2, location = $3, size = $4, description = $5, website = $6 WHERE id = $7`;
    db.none(sql, [name, field, location, size, description, website, id])
      .then(() => res.json({ message: "Startup successfully updated" }))
      .catch(err => res.status(400).json({ error: err.message }));
});
 
app.delete('/startups/:id', (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM startups WHERE id = $1`;
    db.none(sql, id)
      .then(() => res.json({ message: "Startup successfully deleted" }))
      .catch(err => res.status(400).json({ error: err.message }));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
