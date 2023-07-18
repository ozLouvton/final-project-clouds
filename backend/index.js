const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
require("dotenv").config();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE_NAME,
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database: ", err);
    return;
  }
  console.log("Connected to the database");
});

app.get("/", (req, res) => {
  res.send("Up");
});

// Routes
app.get("/api/users", (req, res) => {
  connection.query("SELECT * FROM users", (err, results) => {
    if (err) {
      console.error("Error retrieving users: ", err);
      res.status(500).json({ error: "Failed to retrieve users" });
      return;
    }
    res.json(results);
  });
});

app.post("/api/users", (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    res.status(400).json({ error: "Name and email are required" });
    return;
  }

  const query = "INSERT INTO users (name, email) VALUES (?, ?)";
  connection.query(query, [name, email], (err, result) => {
    if (err) {
      console.error("Error creating user: ", err);
      res.status(500).json({ error: "Failed to create user" });
      return;
    }
    res.status(201).json({ id: result.insertId, name, email });
  });
});

app.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  if (!name || !email) {
    res.status(400).json({ error: "Name and email are required" });
    return;
  }

  const query = "UPDATE users SET name = ?, email = ? WHERE id = ?";
  connection.query(query, [name, email, id], (err, result) => {
    if (err) {
      console.error("Error updating user: ", err);
      res.status(500).json({ error: "Failed to update user" });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json({ id, name, email });
  });
});

app.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM users WHERE id = ?";
  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting user: ", err);
      res.status(500).json({ error: "Failed to delete user" });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json({ message: "User deleted successfully" });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
