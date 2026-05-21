# Skribbl.io Clone 🎨

Hey! This is a multiplayer drawing and guessing game I built, inspired by skribbl.io. I wanted to learn how real-time WebSockets work with React, so I decided to build this from scratch.

You can create a room, share the code with your friends, and take turns drawing and guessing words.

**Live Demo:** [Add your Vercel link here]  
**Live Backend API:** [Add your Render link here]

## 🛠️ Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, Zustand (for state management)
- **Backend:** Node.js, Express
- **Database:** MongoDB (via Mongoose)
- **Real-time:** Socket.IO

## ✨ Features
- **Real-time multiplayer:** Play with your friends in private rooms!
- **Drawing Canvas:** You can draw, change colors, adjust brush size, undo, and clear the board.
- **Game Flow:** Automatically rotates who is drawing and keeps track of rounds and timers.
- **Scoring System:** You get points for guessing the word correctly, and the drawer gets points if people guess their drawing.
- **Live Chat:** See everyone's messages and guesses as they type them in real-time.

## 🚀 Local Setup

If you want to run this project on your own machine, follow these steps:

1. **Clone the repo**
   ```bash
   git clone https://github.com/yourusername/skribbl-clone.git
   cd skribbl-clone
   ```

2. **Setup the Backend**
   Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` folder:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string_here
   CLIENT_URL=http://localhost:5173
   ```
   Start the backend server:
   ```bash
   npm run dev
   ```

3. **Setup the Frontend**
   Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   npm install
   ```
   Create a `.env` file in the `frontend` folder:
   ```env
   VITE_API_URL=http://localhost:5000
   VITE_SOCKET_URL=http://localhost:5000
   ```
   Start the React app:
   ```bash
   npm run dev
   ```

## 🧠 How the Tech Works (What I Learned)

### Socket.IO
This was my first time heavily using WebSockets. Instead of making HTTP requests over and over (like a normal API), Socket.IO keeps a constant open two-way connection between the server and the browser. 
When someone joins a room, the backend groups their socket connection into that specific "room". When a player guesses a word, the server emits a `correct_guess` event back down to everyone in that exact room so their chat updates instantly. It was tricky to handle what happens when someone disconnects mid-game, but I managed it by writing logic to automatically re-assign the host!

### The HTML5 Canvas
Building the drawing board was super fun. It uses the native `<canvas>` HTML element. Every time the user moves their mouse while clicking, I draw a line from their previous mouse position to their current mouse position using `canvas.getContext('2d')`.
To make it multiplayer, I take those exact X and Y coordinates, bundle them with the brush color and size, and shoot them over Socket.IO to all the other players in the room. Their browser receives the coordinates and draws the exact same line at the exact same time.

---
*Feel free to fork this and add your own features!*
