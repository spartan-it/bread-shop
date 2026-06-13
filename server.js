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
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html') || filePath.endsWith('.js') || filePath.endsWith('.css')) {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
  }
}));

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

// API Endpoint to trigger hot-update of code via git pull & server restart
app.post('/api/update-code', (req, res) => {
  console.log("Hot-updating code via git pull...");
  const { exec } = require('child_process');
  exec('git fetch origin main && git reset --hard origin/main && npm install --omit=dev', (err, stdout, stderr) => {
    if (err) {
      console.error('Git update failed:', err);
      return res.status(500).json({ error: 'Git update failed', details: stderr });
    }
    console.log('Git pull output:', stdout);
    res.json({ message: 'Code updated successfully. Restarting server...' });
    
    // Gracefully exit process after 1 second, letting the shell script loop restart the server
    setTimeout(() => {
      process.exit(0);
    }, 1000);
  });
});

// Serve frontend for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Burger Shop running on port ${PORT}`);
});
