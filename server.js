const express = require('express');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const PORT = 8080;

app.use(express.json());
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
  const timestamp = new Date().toISOString(); // ISO timestamp

  const message = {
    alert: alertMessage,
    timestamp: timestamp
  };

  console.log('Received alert:', message);

  // Broadcast the message with timestamp to all WebSocket clients
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });

  res.status(200).json({ message: 'Alert sent to all clients' });
});
