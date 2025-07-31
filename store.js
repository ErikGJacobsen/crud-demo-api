const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, 'data.json');

// Initialize data file if it doesn't exist
if (!fs.existsSync(dataFilePath)) {
  fs.writeFileSync(dataFilePath, JSON.stringify({ items: [], nextId: 1 }));
}

// Read data from file
function readData() {
  const data = JSON.parse(fs.readFileSync(dataFilePath));
  return data;
}

// Write data to file
function writeData(data) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

module.exports = { readData, writeData };
