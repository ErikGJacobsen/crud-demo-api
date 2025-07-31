# CRUD Demo API

A simple CRUD API with a data model consisting of `id`, `name`, and `date` fields. The date format is dd-mm-yyyy.

## Features

- In-memory data storage
- Full CRUD operations (Create, Read, Update, Delete)
- Date format validation
- Ready for OpenShift deployment

## API Endpoints

- `GET /api/items` - Get all items
- `GET /api/items/:id` - Get a specific item by ID
- `POST /api/items` - Create a new item
- `PUT /api/items/:id` - Update an existing item
- `DELETE /api/items/:id` - Delete an item
- `GET /health` - Health check endpoint for OpenShift

## Data Model

```
{
  "id": number,
  "name": string,
  "date": string (format: dd-mm-yyyy)
}
```

## Local Development

1. Install dependencies:
   ```
   npm install
   ```

2. Run the server:
   ```
   npm start
   ```
   
   For development with auto-restart:
   ```
   npm install -g nodemon
   npm run dev
   ```

3. The API will be accessible at http://localhost:3000

## Example API Requests

### Create an item
```bash
curl -X POST -H "Content-Type: application/json" -d '{"name":"Test Item","date":"31-07-2025"}' http://localhost:3000/api/items
```

### Get all items
```bash
curl http://localhost:3000/api/items
```

### Get an item by ID
```bash
curl http://localhost:3000/api/items/1
```

### Update an item
```bash
curl -X PUT -H "Content-Type: application/json" -d '{"name":"Updated Item","date":"01-08-2025"}' http://localhost:3000/api/items/1
```

### Delete an item
```bash
curl -X DELETE http://localhost:3000/api/items/1
```

## OpenShift Deployment

### Option 1: Deploy using OpenShift CLI (oc)

1. Login to OpenShift:
   ```
   oc login
   ```

2. Create a new project:
   ```
   oc new-project crud-demo
   ```

3. Create a new app from source:
   ```
   oc new-app https://github.com/yourusername/crud-demo-api.git
   ```

4. Expose the service:
   ```
   oc expose service crud-demo-api
   ```

### Option 2: Deploy using OpenShift Web Console

1. Create a new project
2. Select "Add to Project" > "Import from Git"
3. Enter your repository URL
4. Configure build settings if needed
5. Click "Create"

## File-based Storage (Alternative to In-memory)

If you need persistence, you can modify the API to use file-based storage. 
Create a file named `store.js` with the following content and update the imports in `server.js`:

```javascript
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
```
