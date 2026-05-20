const express = require('express');
const router = express.Router();

// Import the functions we wrote in our controller
const { createRoom, joinRoom } = require('../controllers/roomController');

// -----------------------------------------------------
// Route:       POST /api/rooms/create
// Description: Generate a room code and save a new room
// -----------------------------------------------------
router.post('/create', createRoom);

// -----------------------------------------------------
// Route:       POST /api/rooms/join
// Description: Verify if a room code is valid before joining
// -----------------------------------------------------
router.post('/join', joinRoom);

module.exports = router;
