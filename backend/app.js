const express = require('express');
const cors = require('cors');
const roomRoutes = require('./routes/roomRoutes');

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173', 
    methods: ['GET', 'POST']
}));

app.use(express.json());

app.use('/api/rooms', roomRoutes);

app.get('/', (req, res) => {
    res.send('Skribbl.io clone API is running!');
});

module.exports = app;
