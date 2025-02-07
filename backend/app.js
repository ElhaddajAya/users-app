const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();  // Create an Express app
const port = 5000;  // Port number for the server

app.use(cors());  // Enable CORS

app.use(bodyParser.json());  // Enable JSON body parsing

// Connect to the SQLite database
const db = new sqlite3.Database('users.db', (err) => {
    if (err) {
        console.error("Error opening database", err);
    } else {
        console.log("Connected to SQLite database");
    }
})

// CRUD 
// Get all users
app.get('/users', (req, res) => {
    db.all("SELECT * FROM users", [], (err, rows) => {
        if (err) {
            throw err;
        }

        res.json(rows);
    })
})

// Get one user
app.get('/users/:id', (req, res) => {
    const id = req.params.id;

    db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
        if (err) {
            throw err;
        }

        res.json(row);
    })
})

// Add new user
app.post('/users', (req, res) => {
    const { name, email, phone } = req.body;

    db.run("INSERT INTO users (name, email, phone) VALUES (?, ?, ?)", [name, email, phone], (err) => {
        if (err) {
            return console.error(err.message);
        }

        res.json({ id: this.lastID, name, email, phone });
    })
})

// Update user
app.put('/users/:id', (req, res) => {
    const id = req.params.id;
    const { name, email, phone } = req.body;

    db.run("UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?", [name, email, phone, id], (err) => {
        if (err) {
            return console.error(err.message);
        }

        res.json({ id, name, email, phone });
    })
})

// Delete user
app.delete('/users/:id', (req, res) => {
    const id = req.params.id;

    db.run("DELETE FROM users WHERE id = ?", [id], (err) => {
        if (err) {
            return console.error(err.message);
        }

        res.json({ id });
    })
})

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
})