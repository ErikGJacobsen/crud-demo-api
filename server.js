const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment');

const app = express();
const PORT = process.env.PORT || 8080; // OpenShift often uses 8080 as the default port
const IP = process.env.IP || '0.0.0.0'; // Bind to all available network interfaces

// Middleware
app.use(bodyParser.json());

// Enable CORS for all routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Log all incoming requests for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

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
app.listen(PORT, IP, () => {
  console.log(`Server is running on ${IP}:${PORT}`);
  console.log('Environment variables:', {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    IP: process.env.IP
  });
  console.log('Available routes:');
  console.log(' - GET    /');
  console.log(' - GET    /health');
  console.log(' - GET    /api/items');
  console.log(' - GET    /api/items/:id');
  console.log(' - POST   /api/items');
  console.log(' - PUT    /api/items/:id');
  console.log(' - DELETE /api/items/:id');
});
