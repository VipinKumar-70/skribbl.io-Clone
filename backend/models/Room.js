const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    roomCode: {
        type: String,
        required: true,
        unique: true
    },
    players: [
        {
            socketId: { type: String, required: true },
            username: { type: String, required: true },
            score: { type: Number, default: 0 },
            isDrawing: { type: Boolean, default: false }
        }
    ],
    settings: {
        maxPlayers: { type: Number, default: 8 },
        rounds: { type: Number, default: 3 },
        drawTime: { type: Number, default: 80 }
    },
    gameStatus: {
        type: String,
        enum: ['waiting', 'playing', 'finished'],
        default: 'waiting'
    }
}, {
    timestamps: true
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
