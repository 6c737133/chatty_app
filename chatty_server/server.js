const express       = require('express');
const WebSocket     = require('ws');
const SocketServer  = WebSocket.Server;
const uuid          = require('uuid');

const PORT = 3001;

const server = express()
    .use(express.static('public'))
    .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${PORT}`));

// Create the WebSockets server
const wss = new SocketServer({ server });

// Define broadcast function
wss.broadcast = (data) => {
    wss.clients.forEach((client) => {
            client.send(JSON.stringify(data));
    });
};

// Handle connection and broadcast the # of users
wss.on('connection', (ws) => {
    console.log('Client connected');
    wss.broadcast({ type: "userCount", numUsers: wss.clients.size });
    
    // Handle messages
    ws.onmessage = (message) => {
        const msgObj = JSON.parse(message.data)
        
        msgObj.id = uuid()
        
        if (msgObj.type === "postMessage") {
            msgObj.type = "incomingMessage"
        }
        if (msgObj.type === "postNotification") {
            msgObj.type = "incomingNotification"
        }
        wss.broadcast(msgObj)
    }
    
    // Set up a callback for when a client closes the socket & broadcast # of users
    ws.on('close', () => {
        console.log('Client disconnected')
        wss.broadcast({ type: "userCount", numUsers: wss.clients.size })
    });
});
