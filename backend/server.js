require('dotenv').config(); // Load environment variables from .env file FIRST
const http = require('http');
const { Server } = require('socket.io');

const app = require('./app');
const connectDB = require('./utils/db');

// 1. Connect to MongoDB database
connectDB();

// 2. Create the HTTP server using our Express app
const server = http.createServer(app);

// 3. Setup Socket.IO for real-time multiplayer features
const io = new Server(server, {
    cors: {
        // Only allow connections from our frontend URL
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        methods: ['GET', 'POST']
    }
});

// Basic Socket.IO connection event
io.on('connection', (socket) => {
    console.log(`User connected with socket id: ${socket.id}`);

    // Listen for when a user disconnects (e.g., closes the tab)
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

// 4. Start listening on the port defined in .env
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
