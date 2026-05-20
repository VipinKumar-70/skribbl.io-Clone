const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true, // No two users can have the exact same username
        trim: true
    },
    totalGames: {
        type: Number,
        default: 0 // Starts at 0 when a new user is created
    },
    wins: {
        type: Number,
        default: 0
    }
}, {
    // Automatically adds 'createdAt' and 'updatedAt' fields
    timestamps: true 
});

const User = mongoose.model('User', userSchema);

module.exports = User;
