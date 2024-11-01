const express = require('express');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const PORT = 8080;

// Middleware to parse JSON requests
app.use(express.json());

// Serve static HTML file for the frontend
app.use(express.static(path.join(__dirname, 'public')));

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('New client connected');
  
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

app.post('/api/alerts', (req, res) => {
  const alertMessage = req.body.alert;
  console.log('Received alert:', alertMessage);

  // Broadcast the alert to all WebSocket clients
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(alertMessage);
    }
  });

  res.status(200).json({ message: 'Alert sent to all clients' });
});
