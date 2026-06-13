const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const dbPath = '/app/data/orders.json';

// Ensure the directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize the orders.json "database" file if it doesn't exist
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify([]));
  console.log("Initialized database file: " + dbPath);
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API Endpoint to get all live orders
app.get('/api/orders', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read database' });
  }
});

// API Endpoint to add a new live order
app.post('/api/orders', (req, res) => {
  try {
    const { name, burger } = req.body;
    if (!name || !burger) {
      return res.status(400).json({ error: 'Name and burger selection are required' });
    }

    const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    const newOrder = {
      id: Date.now(),
      name,
      burger,
      timestamp: new Date().toISOString()
    };
    
    data.push(newOrder);
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    
    console.log(`Saved order: ${name} ordered ${burger}`);
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ error: 'Failed to write to database' });
  }
});

// Serve frontend for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Burger Shop running on port ${PORT}`);
});
