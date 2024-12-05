const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

// Store messages in memory
let messages = [];

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Send all previous messages to the newly connected user
    socket.emit('initial messages', messages);

    // Listen for new messages
    socket.on('chat message', (msg) => {
        const message = {
            text: msg.text,
            sender: socket.id,
            timestamp: Date.now(),
        };
        messages.push(message);
        io.emit('chat message', message); // Broadcast the new message to all clients
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
