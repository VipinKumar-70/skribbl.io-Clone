const rooms = {};

const setupSocket = (io) => {
    io.on('connection', (socket) => {
        console.log(`Socket connected: ${socket.id}`);

        socket.on('create_room', ({ roomCode, username }) => {
            socket.join(roomCode);

            if (!rooms[roomCode]) {
                rooms[roomCode] = [];
            }

            const newPlayer = { socketId: socket.id, username, score: 0 };
            rooms[roomCode].push(newPlayer);

            console.log(`${username} created and joined room ${roomCode}`);
        });

        socket.on('join_room', ({ roomCode, username }) => {
            socket.join(roomCode);

            if (!rooms[roomCode]) {
                rooms[roomCode] = [];
            }

            const newPlayer = { socketId: socket.id, username, score: 0 };
            rooms[roomCode].push(newPlayer);

            console.log(`${username} joined room ${roomCode}`);

            socket.to(roomCode).emit('player_joined', newPlayer);
        });

        socket.on('disconnect', () => {
            console.log(`Socket disconnected: ${socket.id}`);

            let foundRoomCode = null;
            let leftPlayer = null;

            for (const roomCode in rooms) {
                const roomPlayers = rooms[roomCode];
                const playerIndex = roomPlayers.findIndex(p => p.socketId === socket.id);
                
                if (playerIndex !== -1) {
                    foundRoomCode = roomCode;
                    leftPlayer = roomPlayers[playerIndex];
                    roomPlayers.splice(playerIndex, 1);
                    break;
                }
            }

            if (foundRoomCode && leftPlayer) {
                io.to(foundRoomCode).emit('player_left', {
                    username: leftPlayer.username,
                    socketId: socket.id,
                    message: `${leftPlayer.username} has left the game.`
                });

                if (rooms[foundRoomCode].length === 0) {
                    delete rooms[foundRoomCode];
                    console.log(`Room ${foundRoomCode} is empty and was deleted from memory.`);
                }
            }
        });
    });
};

module.exports = setupSocket;
