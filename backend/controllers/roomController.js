const Room = require('../models/Room');

// Helper function to generate a random 4-character room code (e.g., "AB4X")
const generateRoomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};

// -----------------------------------------------------
// CREATE ROOM CONTROLLER
// -----------------------------------------------------
const createRoom = async (req, res) => {
    try {
        const { username, maxPlayers, rounds, drawTime } = req.body;

        // Simple check to make sure they provided a username
        if (!username) {
            return res.status(400).json({ message: 'Username is required to create a room' });
        }

        // 1. Generate a room code
        let roomCode = generateRoomCode();
        
        // 2. Make sure this exact room code isn't already being used in the database
        let roomExists = await Room.findOne({ roomCode });
        while (roomExists) {
            roomCode = generateRoomCode(); // Generate a new one if taken
            roomExists = await Room.findOne({ roomCode });
        }

        // 3. Create a new Room using our Mongoose model
        const newRoom = new Room({
            roomCode,
            settings: {
                maxPlayers: maxPlayers || 8, // fallback to 8 if not provided
                rounds: rounds || 3,         // fallback to 3
                drawTime: drawTime || 80     // fallback to 80 seconds
            }
        });

        // 4. Save to the MongoDB database
        await newRoom.save();

        // 5. Send back a success response
        res.status(201).json({
            message: 'Room created successfully',
            room: newRoom
        });
    } catch (error) {
        console.error('Error in createRoom:', error);
        res.status(500).json({ message: 'Server error while creating the room' });
    }
};

// -----------------------------------------------------
// JOIN ROOM CONTROLLER
// -----------------------------------------------------
const joinRoom = async (req, res) => {
    try {
        const { username, roomCode } = req.body;

        // Simple validation
        if (!username || !roomCode) {
            return res.status(400).json({ message: 'Both Username and Room Code are required' });
        }

        // 1. Find the room. (We uppercase the code so "abc1" matches "ABC1")
        const room = await Room.findOne({ roomCode: roomCode.toUpperCase() });

        // 2. Check if room exists
        if (!room) {
            return res.status(404).json({ message: 'Room not found. Please check the code.' });
        }

        // 3. Check if game is already playing or finished
        if (room.gameStatus !== 'waiting') {
            return res.status(400).json({ message: 'This game has already started or finished.' });
        }

        // 4. Check if the room is full
        if (room.players.length >= room.settings.maxPlayers) {
            return res.status(400).json({ message: 'This room is full.' });
        }

        // Note: We are just validating they CAN join via API. 
        // We will actually add them to the `room.players` array over Socket.IO so it updates live.
        
        // 5. Send back success
        res.status(200).json({
            message: 'Successfully found the room',
            room: room
        });
    } catch (error) {
        console.error('Error in joinRoom:', error);
        res.status(500).json({ message: 'Server error while trying to join the room' });
    }
};

module.exports = {
    createRoom,
    joinRoom
};
