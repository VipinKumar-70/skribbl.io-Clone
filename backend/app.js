const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares setup
// CORS allows our React frontend to communicate with this backend API
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173', 
    methods: ['GET', 'POST']
}));

// Built-in middleware to parse incoming JSON data from HTTP requests
app.use(express.json());

// Import and use our room routes
const roomRoutes = require('./routes/roomRoutes');
app.use('/api/rooms', roomRoutes);

// Basic health-check route so we can test if the server is running in our browser
app.get('/', (req, res) => {
    res.send('Skribbl.io clone API is running!');
});

// We export the 'app' so it can be used in server.js
module.exports = app;
