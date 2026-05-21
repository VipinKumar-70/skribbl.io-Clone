const Room = require('../models/Room');

const generateRoomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};

const createRoom = async (req, res) => {
    try {
        const { username, maxPlayers, rounds, drawTime } = req.body;

        if (!username) {
            return res.status(400).json({ message: 'Username is required to create a room' });
        }

        let roomCode = generateRoomCode();
        let roomExists = await Room.findOne({ roomCode });

        while (roomExists) {
            roomCode = generateRoomCode();
            roomExists = await Room.findOne({ roomCode });
        }

        const newRoom = new Room({
            roomCode,
            settings: {
                maxPlayers: maxPlayers || 8,
                rounds: rounds || 3,
                drawTime: drawTime || 80
            }
        });

        await newRoom.save();

        res.status(201).json({
            message: 'Room created successfully',
            room: newRoom
        });
    } catch (error) {
        console.error('Error in createRoom:', error);
        res.status(500).json({ message: 'Server error while creating the room' });
    }
};

const joinRoom = async (req, res) => {
    try {
        const { username, roomCode } = req.body;

        if (!username || !roomCode) {
            return res.status(400).json({ message: 'Both Username and Room Code are required' });
        }

        const room = await Room.findOne({ roomCode: roomCode.toUpperCase() });

        if (!room) {
            return res.status(404).json({ message: 'Room not found. Please check the code.' });
        }

        if (room.gameStatus !== 'waiting') {
            return res.status(400).json({ message: 'This game has already started or finished.' });
        }

        if (room.players.length >= room.settings.maxPlayers) {
            return res.status(400).json({ message: 'This room is full.' });
        }

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
