# Skribbl.io Clone

A full-stack multiplayer drawing and guessing game built with the MERN stack. Players can create private rooms, generate a unique room code, and have friends join in real-time.

## Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS
- Zustand
- Socket.IO Client

**Backend:**
- Node.js
- Express.js
- MongoDB & Mongoose
- Socket.IO

## Features

- Create private game rooms
- Join rooms via unique 4-character codes
- Real-time multiplayer synchronization
- Live player join and leave updates
- Socket.IO room management

## Folder Structure

```text
skribbl-clone/
├── frontend/    # React UI and state
└── backend/     # Express API and Socket server
```

## Environment Variables

To run this project, you need to create `.env` files in both directories.

**Backend (`backend/.env`)**
```env
PORT=5000
MONGO_URI=your_mongodb_connection
CLIENT_URL=http://localhost:5173
```

**Frontend (`frontend/.env`)**
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## Installation

1. Clone the repository
```bash
git clone <repository-url>
```

2. **Backend Setup**
```bash
cd backend
npm install
npm run dev
```

3. **Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

## API Routes

- `POST /api/rooms/create` - Creates a new room and returns the generated room data
- `POST /api/rooms/join` - Validates a room code and checks if a room is full

## Socket Events

- `create_room` - Emitted when a user initializes a new game lobby
- `join_room` - Emitted to connect a user to an active room channel
- `player_joined` - Broadcasted to the room when a new player connects
- `player_left` - Broadcasted when a player disconnects or closes the tab

## Future Improvements

- Drawing canvas functionality
- Real-time chat system
- Player scoreboard
- Round timer
- Word selection system

## Author

Created by Vipin Kumar.
