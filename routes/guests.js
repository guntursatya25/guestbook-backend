const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const auth = require('../middleware/auth');

const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run("CREATE TABLE guests (id INTEGER PRIMARY KEY, name TEXT, dob TEXT, idCard TEXT, email TEXT)");
});

router.use(auth);

const upload = multer();

// Get all guests
router.get('/', (req, res) => {
  db.all("SELECT * FROM guests", [], (err, rows) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.json(rows);
  });
});

// Create a new guest
router.post('/', upload.none(), (req, res) => {
  const { name, dob, idCard, email } = req.body;

  if (!name || !dob || !idCard || !email) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  db.run(`INSERT INTO guests (name, dob, idCard, email) VALUES (?, ?, ?, ?)`, [name, dob, idCard, email], function(err) {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.status(201).json({ id: this.lastID, });
  });
});

// Search guests by name
router.get('/search', (req, res) => {
  const { name } = req.query;
  db.all("SELECT * FROM guests WHERE name LIKE ?", [`%${name}%`], (err, rows) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.json(rows);
  });
});

module.exports = router;
