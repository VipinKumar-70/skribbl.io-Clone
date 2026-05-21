const getRandomWord = require("../utils/words");

const rooms = {};

const TURN_TIME = 80; 
const MAX_ROUNDS = 3;

const startTurn = (io, roomCode) => {
  const room = rooms[roomCode];
  if (!room) return;

  const drawer = room.players[room.currentDrawerIndex];
  if (!drawer) return;

  const word = getRandomWord();
  room.currentWord = word;
  room.guessedPlayers = [];
  room.timeLeft = TURN_TIME;

  io.to(roomCode).emit("turn_start", {
    drawerUsername: drawer.username,
    round: room.currentRound,
    maxRounds: MAX_ROUNDS,
    wordLength: word.length,
    timeLeft: TURN_TIME,
  });

  io.to(drawer.socketId).emit("your_turn", { word });

  clearInterval(room.timerInterval);
  room.timerInterval = setInterval(() => {
    room.timeLeft -= 1;

    io.to(roomCode).emit("timer_tick", { timeLeft: room.timeLeft });

    if (room.timeLeft <= 0) {
      clearInterval(room.timerInterval);
      endTurn(io, roomCode);
    }
  }, 1000);
};

const endTurn = (io, roomCode) => {
  const room = rooms[roomCode];
  if (!room) return;

  clearInterval(room.timerInterval);

  io.to(roomCode).emit("turn_end", {
    word: room.currentWord,
    message: `The word was: ${room.currentWord}`,
  });

  room.currentDrawerIndex += 1;

  if (room.currentDrawerIndex >= room.players.length) {
    room.currentDrawerIndex = 0;
    room.currentRound += 1;

    if (room.currentRound > MAX_ROUNDS) {
      endGame(io, roomCode);
      return;
    }
  }

  setTimeout(() => {
    startTurn(io, roomCode);
  }, 3000);
};

const endGame = (io, roomCode) => {
  const room = rooms[roomCode];
  if (!room) return;

  room.gameStatus = "ended";

  const sortedPlayers = [...room.players].sort((a, b) => b.score - a.score);

  io.to(roomCode).emit("game_over", {
    players: sortedPlayers,
    winner: sortedPlayers[0]?.username || "Nobody",
  });

  console.log(
    `Game over in room ${roomCode}. Winner: ${sortedPlayers[0]?.username}`,
  );
};

const setupSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on("create_room", ({ roomCode, username }) => {
      socket.join(roomCode);

      if (!rooms[roomCode]) {
        rooms[roomCode] = {
          players: [],
          currentWord: "",
          currentDrawerIndex: 0,
          currentRound: 1,
          gameStatus: "waiting",
          guessedPlayers: [],
          timerInterval: null,
          timeLeft: TURN_TIME,
        };
      }

      const newPlayer = { socketId: socket.id, username, score: 0 };
      rooms[roomCode].players.push(newPlayer);

      console.log(`${username} created and joined room ${roomCode}`);
    });

    socket.on("join_room", ({ roomCode, username }) => {
      socket.join(roomCode);

      if (!rooms[roomCode]) {
        rooms[roomCode] = {
          players: [],
          currentWord: "",
          currentDrawerIndex: 0,
          currentRound: 1,
          gameStatus: "waiting",
          guessedPlayers: [],
          timerInterval: null,
          timeLeft: TURN_TIME,
          host: username,
        };
      }

      const newPlayer = { socketId: socket.id, username, score: 0 };
      rooms[roomCode].players.push(newPlayer);

      console.log(`${username} joined room ${roomCode}`);

      socket.to(roomCode).emit("player_joined", newPlayer);
      socket.emit("host_updated", { host: rooms[roomCode].host });
    });

    socket.on("start_game", ({ roomCode, username }) => {
      const room = rooms[roomCode];
      if (!room) return;
      if (room.gameStatus === "playing") return;
      if (room.host !== username) return;

      room.gameStatus = "playing";
      room.currentRound = 1;
      room.currentDrawerIndex = 0;

      console.log(`Game started in room ${roomCode}`);

      io.to(roomCode).emit("game_started");

      setTimeout(() => {
        startTurn(io, roomCode);
      }, 2000);
    });

    socket.on("draw", (data) => {
      socket.to(data.roomCode).emit("draw", data);
    });

    socket.on("chat_message", (data) => {
      socket.to(data.roomCode).emit("chat_message", {
        username: data.username,
        message: data.message,
      });
    });

    socket.on("guess", ({ roomCode, username, message }) => {
      const room = rooms[roomCode];
      if (!room || room.gameStatus !== "playing") return;

      const drawer = room.players[room.currentDrawerIndex];
      if (drawer && drawer.socketId === socket.id) return;

      if (room.guessedPlayers.includes(socket.id)) return;

      const guess = message.trim().toLowerCase();
      const answer = room.currentWord;

      if (answer && guess === answer) {
        const player = room.players.find((p) => p.socketId === socket.id);
        if (player) {
          player.score += 100;
        }

        if (drawer) {
          drawer.score += 50;
        }

        room.guessedPlayers.push(socket.id);

        io.to(roomCode).emit("correct_guess", {
          username,
          score: player ? player.score : 0,
          drawerScore: drawer ? drawer.score : 0,
          drawerUsername: drawer ? drawer.username : "",
          message: `${username} guessed the word!`,
        });

        console.log(`${username} guessed correctly in room ${roomCode}`);

        const nonDrawerCount = room.players.length - 1;
        if (room.guessedPlayers.length >= nonDrawerCount) {
          endTurn(io, roomCode);
        }
      } else {
        socket.to(roomCode).emit("wrong_guess", {
          username,
          message,
        });
      }
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);

      let foundRoomCode = null;
      let leftPlayer = null;

      for (const roomCode in rooms) {
        const roomPlayers = rooms[roomCode].players;
        const playerIndex = roomPlayers.findIndex(
          (p) => p.socketId === socket.id,
        );

        if (playerIndex !== -1) {
          foundRoomCode = roomCode;
          leftPlayer = roomPlayers[playerIndex];
          roomPlayers.splice(playerIndex, 1);
          break;
        }
      }

      if (foundRoomCode && leftPlayer) {
        const room = rooms[foundRoomCode];

        io.to(foundRoomCode).emit("player_left", {
          username: leftPlayer.username,
          socketId: socket.id,
          message: `${leftPlayer.username} has left the game.`,
        });

        if (room.players.length === 0) {
          clearInterval(room.timerInterval);
          delete rooms[foundRoomCode];
          console.log(
            `Room ${foundRoomCode} is empty and was deleted from memory.`,
          );
        } else {
          if (room.host === leftPlayer.username) {
            const newHost = room.players[0].username;
            room.host = newHost;
            io.to(foundRoomCode).emit("host_updated", { host: newHost });
            console.log(
              `Host disconnected. New host assigned in room ${foundRoomCode}: ${newHost}`,
            );
          }
        }
      }
    });
  });
};

module.exports = setupSocket;
