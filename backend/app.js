const express = require('express');
// const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();  // Charger les variables d'environnement

const app = express();  // Create an Express app
const port = process.env.BACKEND_PORT || 5000;  // Utiliser la variable d'environnement

app.use(cors());  // Enable CORS
app.use(express.json());  // Enable JSON body parsing
// app.use(bodyParser.json());  // Enable JSON body parsing

/************** SQLITE
* 
// Connect to the SQLite database
const db = new sqlite3.Database('users.db', (err) => {
    if (err) {
        console.error("Error opening database", err);
    } else {
        console.log("Connected to SQLite database");
    }
})
*
***************/

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Error connecting to MongoDB", err));

/************** SQLITE
* 
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
*
***************/

// Vérifier et créer la collection si elle n'existe pas
// mongoose.connection.once('open', async () => {
//     const collections = await mongoose.connection.db.listCollections().toArray();
//     const collectionNames = collections.map(col => col.name);

//     if (!collectionNames.includes('users')) {
//         await mongoose.connection.db.createCollection('users');
//         console.log("Collection 'users' créée.");
//     } else {
//         console.log("Collection 'users' existe déjà.");
//     }
// });


// CRUD
const User = require('./models/User.js');

// Get all users
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get one user
app.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add new user
app.post('/users', async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update user
app.put('/users/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) return res.status(404).json({ message: "User not found" });
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete user
app.delete('/users/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ message: "User not found" });
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
})