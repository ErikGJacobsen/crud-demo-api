const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// In-memory data store
const items = [];
let nextId = 1;

// Helper function to validate date format (dd-mm-yyyy)
function isValidDateFormat(dateStr) {
  return moment(dateStr, 'DD-MM-YYYY', true).isValid();
}

// CRUD Routes
// Create - POST /api/items
app.post('/api/items', (req, res) => {
  const { name, date } = req.body;
  
  // Validate input
  if (!name || !date) {
    return res.status(400).json({ error: 'Name and date are required' });
  }
  
  // Validate date format
  if (!isValidDateFormat(date)) {
    return res.status(400).json({ error: 'Date must be in dd-mm-yyyy format' });
  }
  
  const newItem = {
    id: nextId++,
    name,
    date
  };
  
  items.push(newItem);
  res.status(201).json(newItem);
});

// Read all - GET /api/items
app.get('/api/items', (req, res) => {
  res.json(items);
});

// Read one - GET /api/items/:id
app.get('/api/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const item = items.find(item => item.id === id);
  
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }
  
  res.json(item);
});

// Update - PUT /api/items/:id
app.put('/api/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, date } = req.body;
  
  // Find the item index
  const index = items.findIndex(item => item.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }
  
  // Validate input
  if (!name || !date) {
    return res.status(400).json({ error: 'Name and date are required' });
  }
  
  // Validate date format
  if (!isValidDateFormat(date)) {
    return res.status(400).json({ error: 'Date must be in dd-mm-yyyy format' });
  }
  
  // Update the item
  items[index] = {
    ...items[index],
    name,
    date
  };
  
  res.json(items[index]);
});

// Delete - DELETE /api/items/:id
app.delete('/api/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = items.findIndex(item => item.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }
  
  const deletedItem = items[index];
  items.splice(index, 1);
  
  res.json(deletedItem);
});

// Health check for OpenShift
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Root route
app.get('/', (req, res) => {
  res.send('CRUD Demo API is running! Access the API at /api/items');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
